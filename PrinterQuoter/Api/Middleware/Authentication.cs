using Core.Entities;
using Core.Interfaces.Services;
using Google.Apis.Auth;

namespace Api.Middleware;

public class Authentication
{
    public static async Task<User> CurrentUser(string token, IUserService service)
    {
        GoogleJsonWebSignature.Payload payload = await GoogleJsonWebSignature.ValidateAsync(token);
        User currentUser = null;
        if (payload != null)
        {
            currentUser = service.GetByGoogleId(payload.Subject).Result; 
        }
        return currentUser;
    }
}
