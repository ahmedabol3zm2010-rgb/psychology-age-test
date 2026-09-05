using GoldGuard.Services;
using System.Globalization;

namespace GoldGuard.Pages
{
    public partial class SettingsPage : ContentPage
    {
        private readonly ILocalStorageService _localStorageService;

        public SettingsPage(ILocalStorageService localStorageService)
        {
            InitializeComponent();
            _localStorageService = localStorageService;

            LoadSettings();
        }

        private async void LoadSettings()
        {
            try
            {
                var defaultManufacturing = await _localStorageService.GetDecimalAsync("default_manufacturing");
                var defaultDiscount = await _localStorageService.GetDecimalAsync("default_discount");
                var defaultStamp = await _localStorageService.GetDecimalAsync("default_stamp");

                DefaultManufacturingEntry.Text = defaultManufacturing > 0 ? defaultManufacturing.ToString("F1") : "5";
                DefaultDiscountEntry.Text = defaultDiscount > 0 ? defaultDiscount.ToString("F1") : "2";
                DefaultStampEntry.Text = defaultStamp > 0 ? defaultStamp.ToString("F0") : "10";
            }
            catch (Exception ex)
            {
                await DisplayAlert("خطأ", $"حدث خطأ أثناء تحميل الإعدادات: {ex.Message}", "حسناً");
            }
        }

        private async void OnSaveClicked(object sender, EventArgs e)
        {
            try
            {
                if (!decimal.TryParse(DefaultManufacturingEntry.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out var manufacturing) || manufacturing < 0)
                {
                    await DisplayAlert("خطأ", "الرجاء إدخال نسبة المصنعية بشكل صحيح", "حسناً");
                    return;
                }

                if (!decimal.TryParse(DefaultDiscountEntry.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out var discount) || discount < 0)
                {
                    await DisplayAlert("خطأ", "الرجاء إدخال نسبة الخصم بشكل صحيح", "حسناً");
                    return;
                }

                if (!decimal.TryParse(DefaultStampEntry.Text, NumberStyles.Any, CultureInfo.InvariantCulture, out var stamp) || stamp < 0)
                {
                    await DisplayAlert("خطأ", "الرجاء إدخال الدمغة بشكل صحيح", "حسناً");
                    return;
                }

                await _localStorageService.SetDecimalAsync("default_manufacturing", manufacturing);
                await _localStorageService.SetDecimalAsync("default_discount", discount);
                await _localStorageService.SetDecimalAsync("default_stamp", stamp);

                await DisplayAlert("نجاح", "تم حفظ الإعدادات بنجاح", "حسناً");
            }
            catch (Exception ex)
            {
                await DisplayAlert("خطأ", $"حدث خطأ أثناء حفظ الإعدادات: {ex.Message}", "حسناً");
            }
        }

        private async void OnResetClicked(object sender, EventArgs e)
        {
            var result = await DisplayAlert("تأكيد", "هل تريد استعادة القيم الافتراضية؟", "نعم", "لا");
            
            if (result)
            {
                DefaultManufacturingEntry.Text = "5";
                DefaultDiscountEntry.Text = "2";
                DefaultStampEntry.Text = "10";
                
                await OnSaveClicked(sender, e);
            }
        }

        private void OnBackClicked(object sender, EventArgs e)
        {
            Navigation.PopAsync();
        }
    }
}