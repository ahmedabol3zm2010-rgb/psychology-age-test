using GoldGuard.Data;
using GoldGuard.Models;
using GoldGuard.Services;
using System.Globalization;

namespace GoldGuard.Pages
{
    public partial class HistoryPage : ContentPage
    {
        private readonly ILocalStorageService _localStorageService;
        private readonly TransactionRepository _transactionRepository;
        private List<Transaction> _allTransactions;
        private List<Transaction> _filteredTransactions;

        public HistoryPage(ILocalStorageService localStorageService)
        {
            InitializeComponent();
            _localStorageService = localStorageService;
            _transactionRepository = new TransactionRepository(localStorageService);
            _allTransactions = new List<Transaction>();
            _filteredTransactions = new List<Transaction>();

            LoadTransactions();
        }

        private async void LoadTransactions()
        {
            try
            {
                _allTransactions = await _transactionRepository.GetAllAsync();
                _filteredTransactions = _allTransactions.OrderByDescending(t => t.CreatedAt).ToList();
                UpdateTransactionList();
            }
            catch (Exception ex)
            {
                await DisplayAlert("خطأ", $"حدث خطأ أثناء تحميل العمليات: {ex.Message}", "حسناً");
            }
        }

        private void UpdateTransactionList()
        {
            var displayTransactions = _filteredTransactions.Select(t => new
            {
                t.Id,
                t.Type,
                TransactionTypeText = t.TransactionTypeText,
                FormattedDate = t.FormattedDate,
                KaratText = $"عيار {t.Karat}",
                WeightText = $"{t.Weight.ToString("N2", new CultureInfo("ar-EG"))} جرام",
                PriceText = $"{t.GoldPricePerGram.ToString("N2", new CultureInfo("ar-EG"))} جنيه/جرام",
                FormattedTotal = t.FormattedTotal,
                TypeColor = t.Type == TransactionType.Buy ? Colors.DarkGreen : Colors.DarkRed
            }).ToList();

            TransactionsCollection.ItemsSource = displayTransactions;
        }

        private void OnFilterAllClicked(object sender, EventArgs e)
        {
            _filteredTransactions = _allTransactions.OrderByDescending(t => t.CreatedAt).ToList();
            UpdateTransactionList();
        }

        private void OnFilterBuyClicked(object sender, EventArgs e)
        {
            _filteredTransactions = _allTransactions
                .Where(t => t.Type == TransactionType.Buy)
                .OrderByDescending(t => t.CreatedAt)
                .ToList();
            UpdateTransactionList();
        }

        private void OnFilterSellClicked(object sender, EventArgs e)
        {
            _filteredTransactions = _allTransactions
                .Where(t => t.Type == TransactionType.Sell)
                .OrderByDescending(t => t.CreatedAt)
                .ToList();
            UpdateTransactionList();
        }

        private async void OnDeleteClicked(object sender, EventArgs e)
        {
            try
            {
                var button = (Button)sender;
                var transactionId = (Guid)button.CommandParameter;

                var result = await DisplayAlert("تأكيد", "هل تريد حذف هذه العملية؟", "نعم", "لا");
                
                if (result)
                {
                    await _transactionRepository.DeleteAsync(transactionId);
                    LoadTransactions();
                    await DisplayAlert("نجاح", "تم حذف العملية بنجاح", "حسناً");
                }
            }
            catch (Exception ex)
            {
                await DisplayAlert("خطأ", $"حدث خطأ أثناء حذف العملية: {ex.Message}", "حسناً");
            }
        }

        private async void OnClearAllClicked(object sender, EventArgs e)
        {
            if (!_allTransactions.Any())
            {
                await DisplayAlert("معلومات", "لا توجد عمليات لمسحها", "حسناً");
                return;
            }

            var result = await DisplayAlert("تأكيد", "هل تريد مسح جميع العمليات؟", "نعم", "لا");
            
            if (result)
            {
                try
                {
                    await _transactionRepository.ClearAsync();
                    LoadTransactions();
                    await DisplayAlert("نجاح", "تم مسح جميع العمليات بنجاح", "حسناً");
                }
                catch (Exception ex)
                {
                    await DisplayAlert("خطأ", $"حدث خطأ أثناء مسح العمليات: {ex.Message}", "حسناً");
                }
            }
        }

        private void OnBackClicked(object sender, EventArgs e)
        {
            Navigation.PopAsync();
        }
    }
}