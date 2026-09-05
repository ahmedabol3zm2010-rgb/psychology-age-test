namespace GoldGuard.Models
{
    public class AppSettings
    {
        public decimal DefaultManufacturingPercentage { get; set; } = 5.0m;
        public decimal DefaultSellDiscountPercentage { get; set; } = 2.0m;
        public decimal DefaultStampFee { get; set; } = 10.0m;
        public string DefaultCurrency { get; set; } = "EGP";
        public bool UseOfflineMode { get; set; } = false;
        public DateTime LastPriceUpdate { get; set; } = DateTime.MinValue;
        public string ApiProvider { get; set; } = "GoldTimo"; // GoldTimo, GoldBullion, etc.
    }
}