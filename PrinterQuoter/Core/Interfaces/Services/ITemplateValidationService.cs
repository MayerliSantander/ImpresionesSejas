namespace Core.Interfaces.Services;

public interface ITemplateValidationService
{
    Task<string> ValidateTemplateFileAsync(byte[] fileBytes, string fileName);
}
