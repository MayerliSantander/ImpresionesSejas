using System.Text;
using Core.Dtos;
using Core.Interfaces.Services;

namespace Services;

public class QuotationService : IQuotationService
{
    public string BuildQuotationMessage(List<QuotationProductDto> products)
    {
        var sb = new StringBuilder();
        sb.AppendLine("📦 *Cotización generada*:");
        decimal total = 0;

        foreach (var product in products)
        {
            sb.AppendLine($"\n🛍️ *{product.Name}*");
            if (product.SelectedOptions != null && product.SelectedOptions.Count > 0)
            {
                foreach (var option in product.SelectedOptions)
                {
                    sb.AppendLine($"- {option.Key}: {option.Value}");
                }
            }

            decimal price = SimulatePrice(product.SelectedOptions);
            total += price;

            sb.AppendLine($"💵 Estimado: Bs{price}");
        }

        sb.AppendLine($"\n *Total estimado:* Bs{total}");

        return sb.ToString();
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
}
