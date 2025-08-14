using Core.Interfaces.Services;
using DocumentFormat.OpenXml.Packaging;

namespace Services;

public class TemplateValidationService : ITemplateValidationService
{
    private static readonly string[] RequiredFields = new[]
    {
        "{{fecha}}", "{{cliente}}", "{{numero}}", "{{productos}}", "{{total}}", "{{entrega}}", "{{validez}}"
    };

    public async Task<string> ValidateTemplateFileAsync(byte[] fileBytes, string fileName)
    {
        if (fileBytes == null || fileBytes.Length == 0)
            return "Archivo inválido.";

        if (!fileName.EndsWith(".docx", StringComparison.OrdinalIgnoreCase))
            return "Solo se permiten archivos .docx";

        using (var stream = new MemoryStream(fileBytes))
        {
            using (var wordDoc = WordprocessingDocument.Open(stream, false))
            {
                var body = wordDoc.MainDocumentPart.Document.Body;
                string text = body.InnerText;

                foreach (var field in RequiredFields)
                {
                    if (!text.Contains(field))
                    {
                        return $"El archivo debe contener el campo {field}.";
                    }
                }
            }
        }
        return null;
    }
}
