using Hangfire.Dashboard;

namespace CarAuction.API.Middleware;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        // Allow access in development
        if (httpContext.Request.Host.Host == "localhost")
        {
            return true;
        }

        // In production, require authentication and Admin role
        return httpContext.User.Identity?.IsAuthenticated == true &&
               httpContext.User.IsInRole("Admin");
    }
}
