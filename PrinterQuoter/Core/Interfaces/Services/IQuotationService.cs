using Core.Dtos;
using Core.Entities;

namespace Core.Interfaces.Services;

public interface IQuotationService
{
    Task<IEnumerable<ShowQuotationDto>> GetAllQuotations();
    Task<IEnumerable<ShowQuotationDto>> GetPendingConfirmationsAsync();
    ValueTask<ShowQuotationDto> GetQuotationById(Guid quotationId);
    Task<IEnumerable<ShowQuotationDto>> GetQuotationsByUserIdAsync(Guid userId);
    Task<bool> RequestConfirmationAsync(Guid quotationId);
    Task<Quotation> UpdateQuotationStatus(Guid quotationId);
    Task<ShowQuotationDto> CreateQuotation(QuotationDto quotationDto);
    Task<ShowQuotationDto> ConfirmQuotationAsync(Guid quotationId);
}
