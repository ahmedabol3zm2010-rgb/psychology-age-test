namespace GoldGuard.Models
{
    public enum TransactionType
    {
        Buy,
        Sell
    }

    public class Transaction
    {
        public Guid Id { get; set; }
        public TransactionType Type { get; set; }
        public int Karat { get; set; }
        public decimal Weight { get; set; }
        public decimal GoldPricePerGram { get; set; }
        public decimal ManufacturingPercentage { get; set; }
        public decimal StampFee { get; set; }
        public decimal GoldValue { get; set; }
        public decimal ManufacturingValue { get; set; }
        public decimal StampValue { get; set; }
        public decimal Total { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Notes { get; set; } = string.Empty;

        public Transaction()
        {
            Id = Guid.NewGuid();
            CreatedAt = DateTime.Now;
        }

        public string FormattedTotal => Total.ToString("N2", new System.Globalization.CultureInfo("ar-EG"));
        public string FormattedDate => CreatedAt.ToString("dd/MM/yyyy HH:mm", new System.Globalization.CultureInfo("ar-EG"));
        public string TransactionTypeText => Type == TransactionType.Buy ? "شراء" : "بيع";
    }
}