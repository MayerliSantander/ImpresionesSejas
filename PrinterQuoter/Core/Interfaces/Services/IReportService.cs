using Core.Dtos.Reports;

namespace Core.Interfaces.Services;

public interface IReportService
{
    Task<FunnelReportDto> GetFunnelAsync(DateTime from, DateTime to);
    Task<ConversionReportDto> GetConversionAsync(DateTime from, DateTime to);
    Task<List<ExpiringQuotationDto>> GetExpiringAsync(int days, DateTime? from = null, DateTime? to = null);
    Task<List<TopProductDto>> GetTopProductsAsync(DateTime from, DateTime to, int limit = 10);
    Task<IdleItemsDto> GetIdleItemsAsync(DateTime from, DateTime to);
    Task<KpisDto> GetKpisAsync(int windowDays = 30, int stockThreshold = 5);
}
