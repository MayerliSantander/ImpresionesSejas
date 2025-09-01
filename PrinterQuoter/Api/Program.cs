using Core.Interfaces.Repositories;
using Core.Interfaces.Services;
using Core.Interfaces.UseCases;
using DataAccess;
using DataAccess.Repositories;
using DataAccess.UseCases;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Services;

var builder = WebApplication.CreateBuilder(args);

Env.Load();

// Add services to the container.
builder.Services.AddAuthorization();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        builder => builder.WithOrigins("http://localhost:5173", "http://localhost:5174", Environment.GetEnvironmentVariable("PUBLIC_WEB_HOST"))
            .AllowAnyMethod()
            .AllowAnyHeader()
        );
});


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var MySqlVersion = new MySqlServerVersion(new Version(8,0,41));

builder.Services.AddDbContext<SqlContext>(options =>
    {
        options.UseMySql(Environment.GetEnvironmentVariable("CONNECTION_STRING"), MySqlVersion);
    });

builder.Services.AddScoped<IMaterialService, MaterialService>();
builder.Services.AddScoped<IMaterialRepository, MaterialRepository>();
builder.Services.AddScoped<IMaterialUseCase, MaterialUseCase>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserUseCase, UserUseCase>();

builder.Services.AddScoped<IRoleRepository, RoleRepository>();

builder.Services.AddScoped<IActivityService, ActivityService>();
builder.Services.AddScoped<IActivityRepository, ActivityRepository>();
builder.Services.AddScoped<IActivityUseCase, ActivityUseCase>();

builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductUseCase, ProductUseCase>();

builder.Services.AddScoped<IUsedMaterialRepository, UsedMaterialRepository>();

builder.Services.AddScoped<WhatsAppService>();

builder.Services.AddScoped<IInventoryService, InventoryService>();
builder.Services.AddScoped<IInventoryRepository, InventoryRepository>();
builder.Services.AddScoped<IInventoryUseCase, InventoryUseCase>();

builder.Services.AddScoped<IQuotationRepository, QuotationRepository>();
builder.Services.AddScoped<IQuotationUseCase, QuotationUseCase>();

builder.Services.AddScoped<IQuotationService>(provider => {
    var env = provider.GetRequiredService<IWebHostEnvironment>();
    var templatePath = Path.Combine(env.ContentRootPath, "Templates", "plantilla_cotizacion.docx");
    var outputDir = Path.Combine(env.ContentRootPath, "Generated");

    var quotationUseCase = provider.GetRequiredService<IQuotationUseCase>();
    
    return new QuotationService(quotationUseCase, templatePath, outputDir);
});

builder.Services.AddScoped<IQuotationDetailRepository, QuotationDetailRepository>();

builder.Services.AddScoped<ITemplateValidationService, TemplateValidationService>();

builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderUseCase, OrderUseCase>();

builder.Services.AddScoped<IReportService, ReportService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SqlContext>();
    context.Database.Migrate();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseExceptionHandler("/error");

app.UseHttpsRedirection();
app.UseCors("AllowLocalhost");
app.UseAuthorization();
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Generated")),
    RequestPath = "/public"
});

//app.Subscribe();

app.MapControllers();

app.Run();
