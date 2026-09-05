using GoldGuard.Services;
using GoldGuard.Pages;
using Microsoft.Extensions.Logging;

namespace GoldGuard
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });

            // Register services
            builder.Services.AddSingleton<IGoldPriceService, GoldPriceService>();
            builder.Services.AddSingleton<IGoldCalculatorService, GoldCalculatorService>();
            builder.Services.AddSingleton<ILocalStorageService, LocalStorageService>();
            builder.Services.AddSingleton<TransactionRepository>();

            // Register pages
            builder.Services.AddSingleton<MainPage>();
            builder.Services.AddTransient<BuyGoldPage>();
            builder.Services.AddTransient<SellGoldPage>();
            builder.Services.AddTransient<SettingsPage>();
            builder.Services.AddTransient<HistoryPage>();

            // Configure routing
            Routing.RegisterRoute(nameof(BuyGoldPage), typeof(BuyGoldPage));
            Routing.RegisterRoute(nameof(SellGoldPage), typeof(SellGoldPage));
            Routing.RegisterRoute(nameof(SettingsPage), typeof(SettingsPage));
            Routing.RegisterRoute(nameof(HistoryPage), typeof(HistoryPage));

#if DEBUG
            builder.Logging.AddDebug();
#endif

            return builder.Build();
        }
    }
}