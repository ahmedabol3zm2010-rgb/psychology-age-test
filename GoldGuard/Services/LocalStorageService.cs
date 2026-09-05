using Microsoft.Maui.Storage;

namespace GoldGuard.Services
{
    public class LocalStorageService : ILocalStorageService
    {
        public async Task SetStringAsync(string key, string value)
        {
            await Task.Run(() => Preferences.Set(key, value));
        }

        public async Task<string> GetStringAsync(string key)
        {
            return await Task.Run(() => Preferences.Get(key, string.Empty));
        }

        public async Task SetIntAsync(string key, int value)
        {
            await Task.Run(() => Preferences.Set(key, value));
        }

        public async Task<int> GetIntAsync(string key)
        {
            return await Task.Run(() => Preferences.Get(key, 0));
        }

        public async Task SetDecimalAsync(string key, decimal value)
        {
            await Task.Run(() => Preferences.Set(key, value.ToString()));
        }

        public async Task<decimal> GetDecimalAsync(string key)
        {
            var valueStr = await Task.Run(() => Preferences.Get(key, "0"));
            return decimal.TryParse(valueStr, out var value) ? value : 0m;
        }

        public async Task SetBoolAsync(string key, bool value)
        {
            await Task.Run(() => Preferences.Set(key, value));
        }

        public async Task<bool> GetBoolAsync(string key)
        {
            return await Task.Run(() => Preferences.Get(key, false));
        }

        public async Task RemoveAsync(string key)
        {
            await Task.Run(() => Preferences.Remove(key));
        }

        public async Task ClearAsync()
        {
            await Task.Run(() => Preferences.Clear());
        }
    }
}