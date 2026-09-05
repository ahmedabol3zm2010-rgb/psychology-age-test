namespace GoldGuard.Models
{
    public class GoldPrice
    {
        public int Karat { get; set; }
        public decimal BuyPrice { get; set; }
        public decimal SellPrice { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string Currency { get; set; } = "EGP";

        public GoldPrice()
        {
            UpdatedAt = DateTime.Now;
        }

        public GoldPrice(int karat, decimal buyPrice, decimal sellPrice)
        {
            Karat = karat;
            BuyPrice = buyPrice;
            SellPrice = sellPrice;
            UpdatedAt = DateTime.Now;
            Currency = "EGP";
        }

        public string FormattedBuyPrice => BuyPrice.ToString("N2", new System.Globalization.CultureInfo("ar-EG"));
        public string FormattedSellPrice => SellPrice.ToString("N2", new System.Globalization.CultureInfo("ar-EG"));
        public string FormattedUpdateTime => UpdatedAt.ToString("HH:mm:ss", new System.Globalization.CultureInfo("ar-EG"));
    }
}