using Microsoft.Extensions.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace Services;

public class WhatsAppService
{
    public WhatsAppService()
    {
        TwilioClient.Init(
            Environment.GetEnvironmentVariable("TWILIO_ACCOUNT_SID"),
            Environment.GetEnvironmentVariable("TWILIO_AUTH_TOKEN")
        );
    }

    public async Task<bool> SendQuotationDocument(string phone, string filePath)
    {
        try
        {
            var fromNumber = Environment.GetEnvironmentVariable("TWILIO_FROM");
            var host = Environment.GetEnvironmentVariable("PUBLIC_HOST");

            var fileName = Path.GetFileName(filePath);
            var mediaUrl = new Uri($"{host}/public/{fileName}");

            var messageText = 
                "¡Gracias por solicitar tu cotización con Impresiones Sejas!\n\n" +
                "Si deseas continuar con el proceso y convertir esta cotización en una orden de trabajo, por favor ingresa a la sección *Historial de cotizaciones* dentro de nuestra aplicación web y selecciona la opción *Solicitar confirmación* en la cotización correspondiente.\n\n" +
                "Una vez enviada tu solicitud, el administrador se pondrá en contacto contigo para coordinar los últimos detalles y confirmar tu orden.\n\n" +
                "Si tienes alguna duda adicional o deseas realizar una consulta específica, puedes comunicarte a los números o correo que se encuentran en la cotización que has recibido.";

            var result = await MessageResource.CreateAsync(
                from: new PhoneNumber("whatsapp:" + fromNumber),
                to: new PhoneNumber("whatsapp:" + phone),
                body: messageText,
                mediaUrl: new List<Uri> { mediaUrl }
            );

            return result.ErrorCode == null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[WhatsApp ERROR]{ex.Message} \n{ex.StackTrace}");
            return false;
        }
    }
}
