using GoldGuard.Models;

namespace GoldGuard.Services
{
    public interface IGoldPriceService
    {
        Task<List<GoldPrice>> GetCurrentPricesAsync();
        Task<bool> UpdatePricesAsync();
        DateTime LastUpdateTime { get; }
        bool IsOnline { get; }
        List<GoldPrice> GetCachedPrices();
    }
}