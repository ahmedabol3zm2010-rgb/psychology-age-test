using GoldGuard.Models;
using System.Net.Http;
using System.Text.Json;

namespace GoldGuard.Services
{
    public class GoldPriceService : IGoldPriceService
    {
        private readonly HttpClient _httpClient;
        private readonly ILocalStorageService _localStorageService;
        private List<GoldPrice> _cachedPrices;
        private DateTime _lastUpdateTime;
        private bool _isOnline;

        public DateTime LastUpdateTime => _lastUpdateTime;
        public bool IsOnline => _isOnline;

        public GoldPriceService(ILocalStorageService localStorageService)
        {
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(30)
            };
            _localStorageService = localStorageService;
            _cachedPrices = new List<GoldPrice>();
            _isOnline = true;
            LoadCachedPrices();
        }

        public async Task<List<GoldPrice>> GetCurrentPricesAsync()
        {
            try
            {
                // Try to get fresh prices from API
                var freshPrices = await FetchPricesFromApiAsync();
                if (freshPrices != null && freshPrices.Any())
                {
                    _cachedPrices = freshPrices;
                    _lastUpdateTime = DateTime.Now;
                    _isOnline = true;
                    await SaveCachedPricesAsync();
                    return _cachedPrices;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching prices: {ex.Message}");
                _isOnline = false;
            }

            // Fall back to cached prices
            if (_cachedPrices.Any())
            {
                return _cachedPrices;
            }

            // If no cached prices, return default mock data
            return GetDefaultMockPrices();
        }

        public async Task<bool> UpdatePricesAsync()
        {
            try
            {
                var freshPrices = await FetchPricesFromApiAsync();
                if (freshPrices != null && freshPrices.Any())
                {
                    _cachedPrices = freshPrices;
                    _lastUpdateTime = DateTime.Now;
                    _isOnline = true;
                    await SaveCachedPricesAsync();
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating prices: {ex.Message}");
                _isOnline = false;
                return false;
            }
        }

        public List<GoldPrice> GetCachedPrices()
        {
            return _cachedPrices.Any() ? _cachedPrices : GetDefaultMockPrices();
        }

        private async Task<List<GoldPrice>> FetchPricesFromApiAsync()
        {
            try
            {
                // TODO: Replace with actual API call
                // For now, return mock data simulating API response
                await Task.Delay(500); // Simulate network delay
                return GetDefaultMockPrices();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error: {ex.Message}");
                return null;
            }
        }

        private List<GoldPrice> GetDefaultMockPrices()
        {
            return new List<GoldPrice>
            {
                new GoldPrice(24, 5200m, 5150m),
                new GoldPrice(22, 4766.67m, 4716.67m),
                new GoldPrice(21, 4550m, 4500m),
                new GoldPrice(18, 3900m, 3850m),
                new GoldPrice(14, 3033.33m, 2983.33m)
            };
        }

        private void LoadCachedPrices()
        {
            try
            {
                var cachedData = _localStorageService.GetStringAsync("cached_gold_prices").Result;
                if (!string.IsNullOrEmpty(cachedData))
                {
                    var options = new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    };
                    _cachedPrices = JsonSerializer.Deserialize<List<GoldPrice>>(cachedData, options) ?? new List<GoldPrice>();
                    
                    var lastUpdateStr = _localStorageService.GetStringAsync("last_price_update").Result;
                    if (!string.IsNullOrEmpty(lastUpdateStr) && DateTime.TryParse(lastUpdateStr, out var lastUpdate))
                    {
                        _lastUpdateTime = lastUpdate;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading cached prices: {ex.Message}");
            }
        }

        private async Task SaveCachedPricesAsync()
        {
            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true
                };
                var jsonData = JsonSerializer.Serialize(_cachedPrices, options);
                await _localStorageService.SetStringAsync("cached_gold_prices", jsonData);
                await _localStorageService.SetStringAsync("last_price_update", _lastUpdateTime.ToString("o"));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving cached prices: {ex.Message}");
            }
        }
    }
}