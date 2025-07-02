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
            
            var fileName = Path.GetFileName(filePath);
            var mediaUrl = new Uri($"https://1ae2-192-223-121-177.ngrok-free.app/public/{fileName}");

            var result = await MessageResource.CreateAsync(
                from: new PhoneNumber("whatsapp:" + fromNumber),
                to: new PhoneNumber("whatsapp:" + phone),
                body: "Aquí está tu cotización.",
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
