using GoldGuard.Models;
using GoldGuard.Services;
using System.Text.Json;

namespace GoldGuard.Data
{
    public class TransactionRepository
    {
        private readonly ILocalStorageService _localStorageService;
        private const string TransactionsKey = "transactions";

        public TransactionRepository(ILocalStorageService localStorageService)
        {
            _localStorageService = localStorageService;
        }

        public async Task<List<Transaction>> GetAllAsync()
        {
            try
            {
                var data = await _localStorageService.GetStringAsync(TransactionsKey);
                if (string.IsNullOrEmpty(data))
                    return new List<Transaction>();

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
                return JsonSerializer.Deserialize<List<Transaction>>(data, options) ?? new List<Transaction>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading transactions: {ex.Message}");
                return new List<Transaction>();
            }
        }

        public async Task AddAsync(Transaction transaction)
        {
            var transactions = await GetAllAsync();
            transactions.Add(transaction);
            await SaveAsync(transactions);
        }

        public async Task DeleteAsync(Guid transactionId)
        {
            var transactions = await GetAllAsync();
            var transaction = transactions.FirstOrDefault(t => t.Id == transactionId);
            if (transaction != null)
            {
                transactions.Remove(transaction);
                await SaveAsync(transactions);
            }
        }

        public async Task ClearAsync()
        {
            await _localStorageService.RemoveAsync(TransactionsKey);
        }

        private async Task SaveAsync(List<Transaction> transactions)
        {
            try
            {
                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                    WriteIndented = true
                };
                var data = JsonSerializer.Serialize(transactions, options);
                await _localStorageService.SetStringAsync(TransactionsKey, data);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving transactions: {ex.Message}");
            }
        }
    }
}