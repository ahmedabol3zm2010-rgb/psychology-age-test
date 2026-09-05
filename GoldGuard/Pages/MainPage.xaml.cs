using GoldGuard.Models;
using GoldGuard.Services;

namespace GoldGuard.Pages
{
    public partial class MainPage : ContentPage
    {
        private readonly IGoldPriceService _goldPriceService;
        private readonly ILocalStorageService _localStorageService;
        private DateTime _currentDateTime;
        private Timer _dateTimeTimer;

        public MainPage(IGoldPriceService goldPriceService, ILocalStorageService localStorageService)
        {
            InitializeComponent();
            _goldPriceService = goldPriceService;
            _localStorageService = localStorageService;

            // Start timer for updating date/time
            _dateTimeTimer = new Timer(UpdateDateTime, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));

            // Load initial data
            LoadInitialData();
        }

        private async void LoadInitialData()
        {
            try
            {
                // Update connection status
                UpdateConnectionStatus();

                // Load prices
                await LoadPricesAsync();

                // Start auto-update timer for prices (every 5 minutes)
                Device.StartTimer(TimeSpan.FromMinutes(5), async () =>
                {
                    await LoadPricesAsync();
                    return true;
                });
            }
            catch (Exception ex)
            {
                await DisplayAlert("خطأ", $"حدث خطأ أثناء تحميل البيانات: {ex.Message}", "حسناً");
            }
        }

        private void UpdateDateTime(object state)
        {
            _currentDateTime = DateTime.Now;
            
            MainThread.BeginInvokeOnMainThread(() =>
            {
                var culture = new System.Globalization.CultureInfo("ar-EG");
                CurrentDateTimeLabel.Text = _currentDateTime.ToString("dddd, dd MMMM yyyy HH:mm:ss", culture);
            });
        }

        private void UpdateConnectionStatus()
        {
            MainThread.BeginInvokeOnMainThread(() =>
            {
                if (_goldPriceService.IsOnline)
                {
                    ConnectionStatusFrame.BackgroundColor = Colors.LightGreen;
                    ConnectionStatusLabel.Text = "🟢 متصل بالإنترنت";
                    ConnectionStatusLabel.TextColor = Colors.DarkGreen;
                }
                else
                {
                    ConnectionStatusFrame.BackgroundColor = Colors.LightPink;
                    ConnectionStatusLabel.Text = "⚠️ لا يوجد اتصال بالإنترنت - يستخدم آخر أسعار محفوظة";
                    ConnectionStatusLabel.TextColor = Colors.DarkRed;
                }
            });
        }

        private async Task LoadPricesAsync()
        {
            try
            {
                var prices = await _goldPriceService.GetCurrentPricesAsync();
                
                MainThread.BeginInvokeOnMainThread(() =>
                {
                    UpdatePriceLabels(prices);
                    UpdateConnectionStatus();
                    
                    var lastUpdate = _goldPriceService.LastUpdateTime;
                    if (lastUpdate != DateTime.MinValue)
                    {
                        var culture = new System.Globalization.CultureInfo("ar-EG");
                        LastUpdateLabel.Text = $"آخر تحديث: {lastUpdate.ToString("HH:mm:ss", culture)}";
                    }
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading prices: {ex.Message}");
            }
        }

        private void UpdatePriceLabels(List<GoldPrice> prices)
        {
            var price24 = prices.FirstOrDefault(p => p.Karat == 24);
            var price22 = prices.FirstOrDefault(p => p.Karat == 22);
            var price21 = prices.FirstOrDefault(p => p.Karat == 21);
            var price18 = prices.FirstOrDefault(p => p.Karat == 18);
            var price14 = prices.FirstOrDefault(p => p.Karat == 14);

            if (price24 != null)
            {
                Price24Buy.Text = price24.FormattedBuyPrice;
                Price24Sell.Text = price24.FormattedSellPrice;
            }

            if (price22 != null)
            {
                Price22Buy.Text = price22.FormattedBuyPrice;
                Price22Sell.Text = price22.FormattedSellPrice;
            }

            if (price21 != null)
            {
                Price21Buy.Text = price21.FormattedBuyPrice;
                Price21Sell.Text = price21.FormattedSellPrice;
            }

            if (price18 != null)
            {
                Price18Buy.Text = price18.FormattedBuyPrice;
                Price18Sell.Text = price18.FormattedSellPrice;
            }

            if (price14 != null)
            {
                Price14Buy.Text = price14.FormattedBuyPrice;
                Price14Sell.Text = price14.FormattedSellPrice;
            }
        }

        private async void OnUpdatePricesClicked(object sender, EventArgs e)
        {
            try
            {
                UpdatePricesButton.IsEnabled = false;
                UpdatePricesButton.Text = "⏳ جاري التحديث...";

                var success = await _goldPriceService.UpdatePricesAsync();
                
                if (success)
                {
                    await LoadPricesAsync();
                    await DisplayAlert("نجاح", "تم تحديث الأسعار بنجاح", "حسناً");
                }
                else
                {
                    await DisplayAlert("فشل", "فشل تحديث الأسعار. يتم استخدام آخر أسعار محفوظة", "حسناً");
                }
            }
            catch (Exception ex)
            {
                await DisplayAlert("خطأ", $"حدث خطأ أثناء تحديث الأسعار: {ex.Message}", "حسناً");
            }
            finally
            {
                UpdatePricesButton.IsEnabled = true;
                UpdatePricesButton.Text = "🔄 تحديث الأسعار الآن";
            }
        }

        private void OnBuyGoldClicked(object sender, EventArgs e)
        {
            Shell.Current.GoToAsync(nameof(BuyGoldPage));
        }

        private void OnSellGoldClicked(object sender, EventArgs e)
        {
            Shell.Current.GoToAsync(nameof(SellGoldPage));
        }

        private void OnSettingsClicked(object sender, EventArgs e)
        {
            Shell.Current.GoToAsync(nameof(SettingsPage));
        }

        private void OnHistoryClicked(object sender, EventArgs e)
        {
            Shell.Current.GoToAsync(nameof(HistoryPage));
        }

        protected override void OnDisappearing()
        {
            base.OnDisappearing();
            _dateTimeTimer?.Dispose();
        }
    }
}