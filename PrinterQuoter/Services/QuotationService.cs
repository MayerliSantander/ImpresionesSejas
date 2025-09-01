using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Core.Dtos;
using Core.Entities;
using Core.Interfaces.Services;
using Core.Interfaces.UseCases;

namespace Services;

public class QuotationService : IQuotationService
{
    private readonly IQuotationUseCase _quotationUseCase;
    private readonly string _templatePath;
    private readonly string _outputDir;
    public QuotationService(IQuotationUseCase quotationUseCase, string templatePath, string outputDir)
    {
        _quotationUseCase = quotationUseCase;
        _templatePath = templatePath;
        _outputDir = outputDir;
    }
    
    public async Task<IEnumerable<ShowQuotationDto>> GetAllQuotations()
    {
        var quotations = await _quotationUseCase.QuotationRepository.GetAll();
        return quotations.Select(ShowQuotationDto.FromEntity);
    }
    
    public async Task<IEnumerable<ShowQuotationDto>> GetPendingConfirmationsAsync()
    {
        var quotations = await _quotationUseCase.QuotationRepository.GetPendingQuotations();
        return quotations.Select(ShowQuotationDto.FromEntity);
    }
    
    public async ValueTask<ShowQuotationDto> GetQuotationById(Guid quotationId)
    {
        var quotation = await _quotationUseCase.QuotationRepository.GetById(quotationId);
        return ShowQuotationDto.FromEntity(quotation);
    }
    
    public async Task<IEnumerable<ShowQuotationDto>> GetQuotationsByUserIdAsync(Guid userId)
    {
        var quotations = await _quotationUseCase.QuotationRepository.GetQuotationsByUserIdAsync(userId);
        return quotations.Select(ShowQuotationDto.FromEntity);
    }
    
    public async Task<ShowQuotationDto> CreateQuotation(QuotationDto quotationDto)
    {
        var user = await _quotationUseCase.UserRepository.GetById(quotationDto.UserId);
        if (user == null)
        {
            throw new InvalidOperationException("Usuario no encontrado.");
        }
        
        Quotation quotation = quotationDto.CreateQuotation();
        quotation.QuotationNumber = await _quotationUseCase.QuotationRepository.GetNextQuotationNumber();
        quotation.User = user;
        await _quotationUseCase.QuotationRepository.Add(quotation);

        foreach (QuotationDetailDto quotationDetailDto in quotationDto.QuotationDetailDtos)
        {
            try
            {
                QuotationDetail quotationDetail = quotationDetailDto.CreateQuotationDetail();
                
                quotationDetail.Product = await _quotationUseCase.ProductRepository.GetById(quotationDetailDto.ProductId);
                quotationDetail.Material = await _quotationUseCase.MaterialRepository.GetById(quotationDetailDto.MaterialId);
                quotationDetail.QuotationId = quotation.Id;
                
                quotation.QuotationDetails.Add(quotationDetail);
                await _quotationUseCase.QuotationDetailRepository.Add(quotationDetail);
                
                foreach (Guid activityId in quotationDetailDto.ActivityIds)
                {
                    Activity activity = await _quotationUseCase.ActivityRepository.GetById(activityId);
                    if (activity != null)
                    {
                        quotationDetail.Activities.Add(activity);
                    }
                }
                
                quotationDetail.Price = SimulatePrice(quotationDetail);
                quotation.TotalPrice += quotationDetail.Price;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        string path = await BuildQuotationDocument(quotation);
        quotation.DocumentPath = path;

        await _quotationUseCase.Commitment();
        return ShowQuotationDto.FromEntity(quotation);
    }
    
    public async Task<string> BuildQuotationDocument(Quotation quotation)
    {
        if (!File.Exists(_templatePath))
            throw new FileNotFoundException("Plantilla no encontrada en: " + _templatePath);

        if (!Directory.Exists(_outputDir))
            Directory.CreateDirectory(_outputDir);

        string userName = quotation.User.UserName;
        string clientFileName = userName.ToLower().Replace(" ", "_");

        string fileName = $"cotizacion_{clientFileName}_{DateTime.Now:yyyyMMddHHmmss}.docx";
        string outputPath = Path.Combine(_outputDir, fileName);

        File.Copy(_templatePath, outputPath, true);

        using var wordDoc = WordprocessingDocument.Open(outputPath, true);
        var body = wordDoc.MainDocumentPart.Document.Body;

        ReplacePlaceholder(body, "{{fecha}}", DateTime.Now.ToString("dd/MM/yyyy"));
        ReplacePlaceholder(body, "{{cliente}}", userName);
        ReplacePlaceholder(body, "{{numero}}", quotation.QuotationNumber.ToString());
        ReplacePlaceholder(body, "{{entrega}}", "3");
        ReplacePlaceholder(body, "{{validez}}", "7");
        
        var productosParagraph = body.Descendants<Paragraph>()
            .FirstOrDefault(p => p.InnerText.Contains("{{productos}}"));

        if (productosParagraph != null)
        {
            var parent = productosParagraph.Parent;
            var baseProperties = productosParagraph.ParagraphProperties?.CloneNode(true);

            Table table = new Table();

            TableProperties tblProps = new TableProperties(
                new TableBorders(
                    new TopBorder { Val = BorderValues.None },
                    new BottomBorder { Val = BorderValues.None },
                    new LeftBorder { Val = BorderValues.None },
                    new RightBorder { Val = BorderValues.None },
                    new InsideHorizontalBorder { Val = BorderValues.None },
                    new InsideVerticalBorder { Val = BorderValues.None }
                )
            );
            table.AppendChild(tblProps);

            foreach (var quotationDetail in quotation.QuotationDetails)
            {
                int cantidad = quotationDetail.Quantity;
                string descripcion = FormatProductLine(quotationDetail.Product.ProductName, quotationDetail);
                string subtotal = $"Bs. {quotationDetail.Price:F2}";

                TableRow row = new TableRow();

                var cell1 = new TableCell(new Paragraph(new Run(new Text($"{cantidad} Uds."))));
                var cell2 = new TableCell(new Paragraph(new Run(new Text(descripcion))));
                var cell3 = new TableCell(new Paragraph(
                    new ParagraphProperties(new Justification { Val = JustificationValues.Right }),
                    new Run(new Text(subtotal))));

                row.Append(cell1, cell2, cell3);
                table.Append(row);
            }
            body.InsertBefore(table, productosParagraph);
            productosParagraph.Remove();
        }

        ReplacePlaceholder(body, "{{total}}", quotation.TotalPrice.ToString("F2"));
        wordDoc.MainDocumentPart.Document.Save();
        
        return outputPath;
    }   

    private void ReplacePlaceholder(Body body, string placeholder, string newValue)
    {
        foreach (var paragraph in body.Descendants<Paragraph>())
        {
            var texts = paragraph.Descendants<Text>().ToList();
            var fullText = string.Join("", texts.Select(t => t.Text));

            if (fullText.Contains(placeholder))
            {
                var replaced = fullText.Replace(placeholder, newValue);

                foreach (var t in texts)
                    t.Text = string.Empty;

                if (texts.Any())
                    texts.First().Text = replaced;
            }
        }
    }

    public decimal SimulatePrice(QuotationDetail quotationDetail)
    {
        return quotationDetail.Quantity * 4;
    }
    
    private string FormatProductLine(string name, QuotationDetail quotationDetail)
    {
        var parts = new List<string> { name };

        parts.Add("Tamaño " + quotationDetail.Product.SizeInCm);
        parts.Add("en " + quotationDetail.Material.MaterialName);
        parts.Add(quotationDetail.Material.Type);
        foreach (var activities in quotationDetail.Activities)
        {
            parts.Add(activities.ActivityName);
        }
        
        return string.Join(" ", parts);
    }
    
    public async Task<bool> RequestConfirmationAsync(Guid quotationId)
    {
        var quotation = await _quotationUseCase.QuotationRepository.GetById(quotationId);

        if (quotation == null)
        {
            throw new InvalidOperationException("Cotización no encontrada.");
        }
        
        var updatedQuotation = await UpdateQuotationStatus(quotationId);
        if (updatedQuotation.Status == "Vencida")
        {
            throw new InvalidOperationException("La cotización ha expirado.");
        }
        
        if (updatedQuotation.Status == "Confirmada" || updatedQuotation.Status == "Esperando confirmación")
        {
            throw new InvalidOperationException("No se puede solicitar la confirmación una cotización que ya está confirmada o ya solicitada.");
        }

        var productDetails = updatedQuotation.QuotationDetails.ToList();
        
        if (productDetails == null || !productDetails.Any())
        {
            throw new InvalidOperationException("La cotización no tiene productos.");
        }
        
        var isStockAvailable = await _quotationUseCase.InventoryRepository.ValidateStockAsync(productDetails);
        if (!isStockAvailable)
        {
            throw new InvalidOperationException("No hay suficiente stock para los productos de la cotización.");
        }

        updatedQuotation.Status = "Esperando confirmación";
        updatedQuotation.RequestedConfirmationDate = DateTime.Now;
        await _quotationUseCase.QuotationRepository.Update(updatedQuotation);
        await _quotationUseCase.Commitment();
        return true;
    }
    
    public async Task<Quotation> UpdateQuotationStatus(Guid quotationId)
    {
        var quotation = await _quotationUseCase.QuotationRepository.GetById(quotationId);
    
        if (quotation == null)
        {
            throw new InvalidOperationException("Cotización no encontrada.");
        }

        if (quotation.Status == "Confirmada")
        {
            return quotation;
        }

        var expirationDate = quotation.Date.AddDays(quotation.ValidityDays);
        if (expirationDate < DateTime.Now && quotation.Status != "Vencida")
        {
            quotation.Status = "Vencida";
            await _quotationUseCase.QuotationRepository.Update(quotation); 
            await _quotationUseCase.Commitment();
        }
        return quotation;
    }
    
    public async Task<ShowQuotationDto> ConfirmQuotationAsync(Guid quotationId)
    {
        var quotation = await _quotationUseCase.QuotationRepository.GetById(quotationId);
        if (quotation == null) throw new InvalidOperationException("Cotización no encontrada.");

        var refreshed = await UpdateQuotationStatus(quotationId);
        if (refreshed.Status == "Vencida")
            throw new InvalidOperationException("La cotización ha expirado.");

        if (refreshed.Status != "Esperando confirmación")
            throw new InvalidOperationException("La cotización no está en estado 'Esperando confirmación'.");

        if (refreshed.QuotationDetails == null || !refreshed.QuotationDetails.Any())
            throw new InvalidOperationException("La cotización no tiene productos.");

        var details = refreshed.QuotationDetails.ToList();
        var ok = await _quotationUseCase.InventoryRepository.ValidateStockAsync(details);
        if (!ok) throw new InvalidOperationException("No hay suficiente stock para los productos seleccionados.");

        var adjustments = BuildAdjustmentsFromDetails(details);

        await _quotationUseCase.InventoryRepository.AdjustStockAsync(adjustments);

        var order = new Order
        {
            Id = Guid.NewGuid(),
            QuotationId = refreshed.Id,
            ConfirmationDate = DateTime.Now,
            DeliveryDate = DateTime.Now.AddDays(3)
        };
        await _quotationUseCase.OrderRepository.Add(order);

        refreshed.Status = "Confirmada";
        await _quotationUseCase.QuotationRepository.Update(refreshed);

        await _quotationUseCase.Commitment();

        return ShowQuotationDto.FromEntity(refreshed);
    }
    
    private static List<StockAdjustmentDto> BuildAdjustmentsFromDetails(IEnumerable<QuotationDetail> details)
    {
        var byMaterial = new Dictionary<Guid, int>();

        foreach (var d in details)
        {
            if (d.Product?.UsedMaterials == null || !d.Product.UsedMaterials.Any())
                continue;
            
            if (d.MaterialId == Guid.Empty)
                continue;
            
            var um = d.Product.UsedMaterials
                .FirstOrDefault(x => x.MaterialId == d.MaterialId);
            
            if (um == null)
            {
                continue;
            }
            
            var required = (int)Math.Ceiling(
                (decimal)um.Quantity * d.Quantity / Math.Max(1, d.Product.MinimumQuantity)
            );
            
            if (!byMaterial.ContainsKey(um.MaterialId))
                byMaterial[um.MaterialId] = 0;

            byMaterial[um.MaterialId] += required;
        }

        return byMaterial.Select(kv => new StockAdjustmentDto
        {
            MaterialId = kv.Key,
            QuantityToDeduct = kv.Value
        }).ToList();
    }
}
