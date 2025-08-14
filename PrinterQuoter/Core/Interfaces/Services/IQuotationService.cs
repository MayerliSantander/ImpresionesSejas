using Core.Dtos;
using Core.Entities;

namespace Core.Interfaces.Services;

public interface IQuotationService
{
    ValueTask<ShowQuotationDto> GetQuotationById(Guid quotationId);
    Task<IEnumerable<ShowQuotationDto>> GetQuotationsByUserIdAsync(Guid userId);
    Task<bool> RequestConfirmationAsync(Guid quotationId);
    Task<Quotation> UpdateQuotationStatus(Guid quotationId);
    Task<ShowQuotationDto> CreateQuotation(QuotationDto quotationDto);
}
