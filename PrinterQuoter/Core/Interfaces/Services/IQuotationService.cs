using Core.Dtos;

namespace Core.Interfaces.Services;

public interface IQuotationService
{
    Task<string> BuildQuotationDocument(List<QuotationProductDto> products, string clientName);
    decimal SimulatePrice(Dictionary<string, string> options);
}
