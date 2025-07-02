using System.Text;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using Core.Dtos;
using Core.Interfaces.Services;

namespace Services;

public class QuotationService : IQuotationService
{
    private readonly string _templatePath;
    private readonly string _outputDir;
    public QuotationService(string templatePath, string outputDir)
    {
        _templatePath = templatePath;
        _outputDir = outputDir;
    }
    public async Task<string> BuildQuotationDocument(List<QuotationProductDto> products, string clientName)
    {
        if (!File.Exists(_templatePath))
            throw new FileNotFoundException("Plantilla no encontrada en: " + _templatePath);

        if (!Directory.Exists(_outputDir))
            Directory.CreateDirectory(_outputDir);

        string clientFileName = clientName.ToLower().Replace(" ", "_");

        string fileName = $"cotizacion_{clientFileName}_{DateTime.Now:yyyyMMddHHmmss}.docx";
        string outputPath = Path.Combine(_outputDir, fileName);

        File.Copy(_templatePath, outputPath, true);

        using var wordDoc = WordprocessingDocument.Open(outputPath, true);
        var body = wordDoc.MainDocumentPart.Document.Body;

        ReplacePlaceholder(body, "{{fecha}}", DateTime.Now.ToString("dd/MM/yyyy"));
        ReplacePlaceholder(body, "{{cliente}}", clientName);
        ReplacePlaceholder(body, "{{entrega}}", "3 días hábiles");
        ReplacePlaceholder(body, "{{validez}}", "7 días");

        decimal total = 0;

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

            foreach (var product in products)
            {
                decimal price = SimulatePrice(product.SelectedOptions);
                total += price;

                string cantidad = product.SelectedOptions.TryGetValue("Cantidad", out var val) ? val : "";
                string descripcion = FormatProductLine(product.Name, product.SelectedOptions);
                string subtotal = $"Bs. {price:F2}";

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

        ReplacePlaceholder(body, "{{subtotal}}", total.ToString("F2"));
        ReplacePlaceholder(body, "{{total}}", total.ToString("F2"));
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

    public decimal SimulatePrice(Dictionary<string, string> options)
    {
        if (options.TryGetValue("Cantidad", out string cantidadStr) &&
            int.TryParse(cantidadStr, out int cantidad))
        {
            return cantidad * 0.05m;
        }
        return 0;
    }
    
    private string FormatProductLine(string name, Dictionary<string, string> options)
    {
        var parts = new List<string> { name };

        if (options.TryGetValue("Tamaño", out var tam))
            parts.Add("Tamaño " + tam);

        if (options.TryGetValue("Papel", out var papel))
            parts.Add("en papel " + papel);

        if (options.TryGetValue("Impresión", out var imp))
            parts.Add("Impresión " + imp);

        return string.Join(" ", parts);
    }

    private string FormatOptions(Dictionary<string, string> options)
    {
        return string.Join(", ", options.Select(kv => $"{kv.Key}: {kv.Value}"));
    }
}
