using GoldGuard.Models;
using GoldGuard.Services;
using System.Globalization;

namespace GoldGuard.Pages
{
    public partial class SellGoldPage : ContentPage
    {
        private readonly IGoldPriceService _goldPriceService;
        private readonly ILocalStorageService _localStorageService;
        private readonly IGoldCalculatorService _calculatorService;
        private List<GoldPrice> _currentPrices;
        private SellCalculationResult _lastCalculationResult;

        public SellGoldPage(IGoldPriceService goldPriceService, ILocalStorageService localStorageService)
        {
            InitializeComponent();
            _goldPriceService = goldPriceService;
            _localStorageService = localStorageService;
            _calculatorService = new GoldCalculatorService();
            _currentPrices = new List<GoldPrice>();

            LoadInitialData();
        }

        private async void LoadInitialData()
        {
            try
            {
                _currentPrices = await _goldPriceService.GetCurrentPricesAsync();
                
                // Set default karat to 21
                KaratPicker.SelectedIndex = 2; // 21 is at index 2
                
                // Load default discount from settings
                var defaultDiscount = await _localStorageService.GetDecimalAsync("default_discount");
                
                if (defaultDiscount > 0)
                    DiscountEntry.Text = defaultDiscount.ToString("F1");
                
                UpdatePriceForSelectedKarat();
            }
            catch (Exception ex)
            {
                await DisplayAlert("خطأ", $"حدث خطأ أثناء تحميل البيانات: {ex.Message}", "حسناً");
            }
        }

        private void OnKaratChanged(object sender, EventArgs e)
        {
            UpdatePriceForSelectedKarat();
        }

        private void UpdatePriceForSelectedKarat()
        {
            if (KaratPicker.SelectedIndex == -1) return;

            var selectedKarat = int.Parse(KaratPicker.Items[KaratPicker.SelectedIndex]);
            var price = _currentPrices.FirstOrDefault(p => p.Karat == selectedKarat);

            if (price != null)
            {
                PricePerGramEntry.Text = price.BuyPrice.ToString("F2", CultureInfo.InvariantCulture);
            }
        }

        private void OnPriceChanged(object sender, EventArgs e)
        {
            // Auto-calculate when price changes
            OnCalculationInputChanged(sender, e);
        }

        private void OnCalculationInputChanged(object sender, EventArgs e)
        {
            // Real-time calculation can be implemented here
            // For now, we'll wait for the user to click the calculate button
        }

        private void OnCalculateClicked(object sender, EventArgs e)
        {
            try
            {
                // Validate inputs
                if (!decimal.TryParse(PricePerGramEntry.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out var pricePerGram) || pricePerGram <= 0)
                {
                    DisplayAlert("خطأ", "الرجاء إدخال سعر الجرام بشكل صحيح", "حسناً");
                    return;
                }

                if (!decimal.TryParse(WeightEntry.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out var weight) || weight <= 0)
                {
                    DisplayAlert("خطأ", "الرجاء إدخال الوزن بشكل صحيح", "حسناً");
                    return;
                }

                if (!decimal.TryParse(DiscountEntry.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out var discountPercentage) || discountPercentage < 0)
                {
                    DisplayAlert("خطأ", "الرجاء إدخال نسبة الخصم بشكل صحيح", "حسناً");
                    return;
                }

                // Perform calculation
                _lastCalculationResult = _calculatorService.CalculateSell(
                    pricePerGram, 
                    weight, 
                    discountPercentage
                );

                // Update UI
                var culture = new CultureInfo("ar-EG");
                OriginalPriceLabel.Text = _lastCalculationResult.OriginalPricePerGram.ToString("N2", culture) + " جنيه";
                DiscountPercentageLabel.Text = _lastCalculationResult.DiscountPercentage.ToString("F1", culture) + "%";
                DiscountValueLabel.Text = _lastCalculationResult.DiscountValuePerGram.ToString("N2", culture) + " جنيه";
                NetPriceLabel.Text = _lastCalculationResult.NetPricePerGram.ToString("N2", culture) + " جنيه";
                WeightLabel.Text = _lastCalculationResult.Weight.ToString("N2", culture) + " جرام";
                TotalLabel.Text = _lastCalculationResult.Total.ToString("N2", culture) + " جنيه";

                ResultsFrame.IsVisible = true;
                ComparisonFrame.IsVisible = true;
            }
            catch (Exception ex)
            {
                DisplayAlert("خطأ", $"حدث خطأ أثناء الحساب: {ex.Message}", "حسناً");
            }
        }

        private void OnCompareClicked(object sender, EventArgs e)
        {
            try
            {
                if (_lastCalculationResult == null)
                {
                    DisplayAlert("خطأ", "الرجاء إجراء الحساب أولاً", "حسناً");
                    return;
                }

                if (!decimal.TryParse(ShopPriceEntry.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out var shopPrice) || shopPrice <= 0)
                {
                    DisplayAlert("خطأ", "الرجاء إدخال سعر المحل بشكل صحيح", "حسناً");
                    return;
                }

                var expectedPrice = _lastCalculationResult.Total;
                var difference = shopPrice - expectedPrice;
                var differencePercent = (difference / expectedPrice) * 100;

                var culture = new CultureInfo("ar-EG");
                string resultText;

                if (difference > 0)
                {
                    resultText = $"✅ الفرق: +{difference.ToString("N2", culture)} جنيه ({differencePercent.ToString("F1", culture)}%)\n\n" +
                                $"المحل عرض أكثر من السعر المتوقع!";
                    ComparisonResultLabel.TextColor = Colors.DarkGreen;
                }
                else if (difference < 0)
                {
                    resultText = $"⚠️ الفرق: {difference.ToString("N2", culture)} جنيه ({differencePercent.ToString("F1", culture)}%)\n\n" +
                                $"المحل عرض أقل من السعر المتوقع.\n\n" +
                                $"ملاحظة: هذا قد يكون بسبب اختلاف المصنعية أو رسوم أخرى.";
                    ComparisonResultLabel.TextColor = Colors.DarkRed;
                }
                else
                {
                    resultText = $"✅ السعر متطابق تماماً!";
                    ComparisonResultLabel.TextColor = Colors.DarkGreen;
                }

                ComparisonResultLabel.Text = resultText;
            }
            catch (Exception ex)
            {
                DisplayAlert("خطأ", $"حدث خطأ أثناء المقارنة: {ex.Message}", "حسناً");
            }
        }

        private async void OnShareClicked(object sender, EventArgs e)
        {
            try
            {
                if (_lastCalculationResult == null)
                {
                    await DisplayAlert("خطأ", "الرجاء إجراء الحساب أولاً", "حسناً");
                    return;
                }

                var karat = KaratPicker.SelectedItem?.ToString() ?? "غير محدد";
                var culture = new CultureInfo("ar-EG");
                
                var shareText = $"🥇 حاسبة الذهب - بيع\n\n" +
                               $"عيار: {karat}\n" +
                               $"الوزن: {decimal.Parse(WeightEntry.Text).ToString("N2", culture)} جرام\n" +
                               $"سعر الجرام: {decimal.Parse(PricePerGramEntry.Text).ToString("N2", culture)} جنيه\n" +
                               $"نسبة الخصم: {DiscountEntry.Text}%\n\n" +
                               $"🟡 سعر الجرام الحالي: {_lastCalculationResult.OriginalPricePerGram.ToString("N2", culture)} جنيه\n" +
                               $"📉 الخصم: {_lastCalculationResult.DiscountValuePerGram.ToString("N2", culture)} جنيه/جرام\n" +
                               $"💵 القيمة المتوقعة للبيع: {_lastCalculationResult.Total.ToString("N2", culture)} جنيه\n\n" +
                               $"تم الحساب بواسطة تطبيق حارس الذهب";

                await ShareTextAsync(shareText);
            }
            catch (Exception ex)
            {
                await DisplayAlert("خطأ", $"حدث خطأ أثناء المشاركة: {ex.Message}", "حسناً");
            }
        }

        private async Task ShareTextAsync(string text)
        {
            try
            {
                await Share.Default.RequestAsync(new ShareTextRequest
                {
                    Text = text,
                    Title = "مشاركة نتيجة حساب الذهب"
                });
            }
            catch (Exception ex)
            {
                await DisplayAlert("خطأ", $"المشاركة غير مدعومة على هذا الجهاز: {ex.Message}", "حسناً");
            }
        }

        private void OnBackClicked(object sender, EventArgs e)
        {
            Navigation.PopAsync();
        }
    }
}