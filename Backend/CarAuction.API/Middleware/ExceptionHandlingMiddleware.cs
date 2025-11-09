using System.Net;
using System.Text.Json;
using CarAuction.Application.DTOs.Common;
using CarAuction.Application.Exceptions;

namespace CarAuction.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = exception switch
        {
            Application.Exceptions.NotFoundException notFoundException => new
            {
                StatusCode = (int)HttpStatusCode.NotFound,
                Response = ApiResponse<object>.ErrorResponse(notFoundException.Message)
            },
            Application.Exceptions.ValidationException validationException => new
            {
                StatusCode = (int)HttpStatusCode.BadRequest,
                Response = ApiResponse<object>.ErrorResponse(
                    validationException.Message,
                    validationException.Errors.SelectMany(e => e.Value).ToList())
            },
            BadRequestException badRequestException => new
            {
                StatusCode = (int)HttpStatusCode.BadRequest,
                Response = ApiResponse<object>.ErrorResponse(badRequestException.Message)
            },
            UnauthorizedException unauthorizedException => new
            {
                StatusCode = (int)HttpStatusCode.Unauthorized,
                Response = ApiResponse<object>.ErrorResponse(unauthorizedException.Message)
            },
            ForbiddenException forbiddenException => new
            {
                StatusCode = (int)HttpStatusCode.Forbidden,
                Response = ApiResponse<object>.ErrorResponse(forbiddenException.Message)
            },
            _ => new
            {
                StatusCode = (int)HttpStatusCode.InternalServerError,
                Response = ApiResponse<object>.ErrorResponse("An internal server error occurred. Please try again later.")
            }
        };

        context.Response.StatusCode = response.StatusCode;

        // Log the exception with appropriate level
        if (response.StatusCode >= 500)
        {
            _logger.LogError(exception,
                "An unhandled exception occurred while processing the request. Status: {StatusCode}, Path: {Path}",
                response.StatusCode, context.Request.Path);
        }
        else if (response.StatusCode >= 400)
        {
            _logger.LogWarning(exception,
                "A client error occurred. Status: {StatusCode}, Path: {Path}, Message: {Message}",
                response.StatusCode, context.Request.Path, exception.Message);
        }

        var jsonResponse = JsonSerializer.Serialize(response.Response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        });

        await context.Response.WriteAsync(jsonResponse);
    }
}
