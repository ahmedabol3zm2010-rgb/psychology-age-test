namespace GoldGuard.Services
{
    public interface ILocalStorageService
    {
        Task SetStringAsync(string key, string value);
        Task<string> GetStringAsync(string key);
        Task SetIntAsync(string key, int value);
        Task<int> GetIntAsync(string key);
        Task SetDecimalAsync(string key, decimal value);
        Task<decimal> GetDecimalAsync(string key);
        Task SetBoolAsync(string key, bool value);
        Task<bool> GetBoolAsync(string key);
        Task RemoveAsync(string key);
        Task ClearAsync();
    }
}