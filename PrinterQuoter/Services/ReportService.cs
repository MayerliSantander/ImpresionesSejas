using Core.Dtos.Reports;
using Core.Entities;
using Core.Interfaces.Services;
using Core.Interfaces.UseCases;

namespace Services;

public class ReportService : IReportService
{
    private readonly IQuotationUseCase _uc;

    public ReportService(IQuotationUseCase quotationUseCase)
    {
        _uc = quotationUseCase;
    }

    public async Task<FunnelReportDto> GetFunnelAsync(DateTime from, DateTime to)
    {
        var qs = await _uc.QuotationRepository.GetByDateRangeAsync(from.Date, to.Date);

        var expired  = qs.Count(q => q.Status == "Vencida");
        var waiting = qs.Count(q => q.Status == "Esperando confirmación");

        var orders = await _uc.OrderRepository.CountByConfirmationDateRangeAsync(from.Date, to.Date);

        return new FunnelReportDto
        {
            Expired  = expired,
            Waiting = waiting,
            Orders   = orders
        };
    }
    
    public async Task<ConversionReportDto> GetConversionAsync(DateTime from, DateTime to)
    {
        var f = from.Date;
        var t = to.Date;

        var qs = await _uc.QuotationRepository.GetByDateRangeAsync(f, t);
        var total = qs.Count();

        var orders = await _uc.OrderRepository.GetByQuotationDateRangeAsync(f, t);
        var confirmed = orders.Count;

        double? daysProm = null;
        if (orders.Any())
        {
            var qIds = orders.Select(o => o.QuotationId).Distinct().ToList();
            var qsByIds = await _uc.QuotationRepository.GetByIdsAsync(qIds);
            var qMap = qsByIds.ToDictionary(x => x.Id, x => x.Date);

            var diffs = orders
                .Where(o => qMap.ContainsKey(o.QuotationId))
                .Select(o => (o.ConfirmationDate - qMap[o.QuotationId]).TotalDays);

            daysProm = diffs.Any() ? diffs.Average() : null;
        }

        var pct = total == 0 ? 0m : Math.Round((decimal)confirmed * 100m / total, 2);

        return new ConversionReportDto
        {
            Quotations = total,
            Confirmed = confirmed,
            ConversionPct = pct,
            AverageDaysConfirmation = daysProm
        };
    }

    public async Task<List<ExpiringQuotationDto>> GetExpiringAsync(int days, DateTime? from = null, DateTime? to = null)
    {
        IEnumerable<Quotation> qs;

        if (from.HasValue && to.HasValue)
            qs = await _uc.QuotationRepository.GetByDateRangeAsync(from.Value.Date, to.Value.Date);
        else
            qs = await _uc.QuotationRepository.GetAll();

        var now = DateTime.Now;
        var toEdge = now.Date.AddDays(days + 1).AddTicks(-1);

        var candidates = qs
            .Where(q => q.Status != "Confirmada" && q.Status != "Vencida")
            .Select(q => new
            {
                Q = q,
                ExpireIn = q.Date.AddDays(q.ValidityDays)
            })
            .Where(x => x.ExpireIn >= now && x.ExpireIn <= toEdge)
            .OrderBy(x => x.ExpireIn)
            .ToList();

        var userIds = candidates.Select(x => x.Q.UserId).Distinct().ToList();
        var users = await _uc.UserRepository.GetByIdsAsync(userIds);
        var uMap = users.ToDictionary(u => u.Id, u => u.UserName);

        return candidates.Select(x => new ExpiringQuotationDto
        {
            Id = x.Q.Id,
            QuotationNumber = x.Q.QuotationNumber,
            UserName = uMap.TryGetValue(x.Q.UserId, out var name) ? name : "",
            Date = x.Q.Date,
            ExpiresIn = x.ExpireIn,
            Status = x.Q.Status
        }).ToList();
    }

    public async Task<List<TopProductDto>> GetTopProductsAsync(DateTime from, DateTime to, int limit = 10)
    {
        var f = from.Date;
        var t = to.Date;

        var confirmed = await _uc.QuotationRepository.GetByStatusAndDateRangeAsync("Confirmada", f, t);
        var qIds = confirmed.Select(q => q.Id).ToList();
        if (qIds.Count == 0) return new List<TopProductDto>();

        var details = await _uc.QuotationDetailRepository.GetByQuotationIdsAsync(qIds);

        var pIds = details.Select(d => d.ProductId).Distinct().ToList();
        var products = await _uc.ProductRepository.GetByIdsAsync(pIds);
        var pMap = products.ToDictionary(p => p.Id, p => p.ProductName);

        return details
            .GroupBy(d => d.ProductId)
            .Select(g => new TopProductDto
            {
                ProductName = pMap.TryGetValue(g.Key, out var name) ? name : "(Producto)",
                Units = g.Sum(x => x.Quantity),
                Income = g.Sum(x => x.Price)
            })
            .OrderByDescending(x => x.Income)
            .ThenByDescending(x => x.Units)
            .Take(limit)
            .ToList();
    }
    
    public async Task<IdleItemsDto> GetIdleItemsAsync(DateTime from, DateTime to)
    {
        var f = from.Date;
        var t = to.Date;

        var confirmed = await _uc.QuotationRepository.GetByStatusAndDateRangeAsync("Confirmada", f, t);
        var qIds = confirmed.Select(q => q.Id).ToList();

        var confirmedDetails = qIds.Count > 0
            ? await _uc.QuotationDetailRepository.GetByQuotationIdsAsync(qIds)
            : new List<QuotationDetail>();

        var productsForSale = new HashSet<Guid>(confirmedDetails.Select(d => d.ProductId));
        var consumedMaterials = new HashSet<Guid>(confirmedDetails.Select(d => d.MaterialId));

        var allProducts = await _uc.ProductRepository.GetAll();
        var allMaterials = await _uc.MaterialRepository.GetAll();

        var idleProducts = allProducts
            .Where(p => !productsForSale.Contains(p.Id))
            .Select(p => new IdleProductItemDto
            {
                ProductId = p.Id,
                ProductName = p.ProductName,
                Category = p.Category
            })
            .ToList();

        var idleMaterials = allMaterials
            .Where(m => !consumedMaterials.Contains(m.Id))
            .Select(m => new IdleMaterialItemDto
            {
                MaterialId = m.Id,
                MaterialName = m.MaterialName,
                MaterialType = m.Type
            })
            .ToList();

        return new IdleItemsDto
        {
            Products = idleProducts,
            Materials = idleMaterials
        };
    }

    public async Task<KpisDto> GetKpisAsync(int windowDays = 30, int stockThreshold = 5)
    {
        var today = DateTime.Now.Date;
        var f = today.AddDays(-windowDays);
        var t = today;

        var todayQuo = await _uc.QuotationRepository.GetByDateRangeAsync(today, today);
        var todayQuotations = todayQuo.Count();

        var qsWindow = await _uc.QuotationRepository.GetByDateRangeAsync(f, t);
        var totalWindow = qsWindow.Count();

        var ordersWindow = await _uc.OrderRepository.GetByQuotationDateRangeAsync(f, t);
        var confirmedWindow = ordersWindow.Count;
        var conversionPct = totalWindow == 0 ? 0m : Math.Round((decimal)confirmedWindow * 100m / totalWindow, 2);

        var confirmed = await _uc.QuotationRepository.GetByStatusAndDateRangeAsync("Confirmada", f, t);
        var amountConfirmed30d = confirmed.Sum(q => q.TotalPrice);

        var toExpire3d = await GetExpiringAsync(3);

        var criticalStock = await _uc.InventoryRepository.CountBelowOrEqualAsync(stockThreshold);

        return new KpisDto
        {
            QuotationsToday = todayQuotations,
            Conversion30dPct = conversionPct,
            AmountConfirmed30d = amountConfirmed30d,
            ToExpireIn3d = toExpire3d.Count,
            CriticalStock = criticalStock
        };
    }
}
    