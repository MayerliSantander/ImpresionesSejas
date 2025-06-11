using Core.Dtos;

namespace Core.Interfaces.Services;

public interface IQuotationService
{
    string BuildQuotationMessage(List<QuotationProductDto> products);
    decimal SimulatePrice(Dictionary<string, string> options);
}
