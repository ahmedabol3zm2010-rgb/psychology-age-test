using GoldGuard.Models;

namespace GoldGuard.Services
{
    public interface IGoldCalculatorService
    {
        decimal CalculateGoldValue(decimal pricePerGram, decimal weight);
        decimal CalculateManufacturingValue(decimal goldValue, decimal manufacturingPercentage);
        decimal CalculateStampValue(decimal stampFeePerGram, decimal weight);
        decimal CalculateBuyTotal(decimal goldValue, decimal manufacturingValue, decimal stampValue, decimal extraFees = 0);
        decimal CalculateSellPriceAfterDiscount(decimal pricePerGram, decimal discountPercentage);
        decimal CalculateSellTotal(decimal netPricePerGram, decimal weight);
        BuyCalculationResult CalculateBuy(decimal pricePerGram, decimal weight, decimal manufacturingPercentage, decimal stampFee, decimal extraFees = 0);
        SellCalculationResult CalculateSell(decimal pricePerGram, decimal weight, decimal discountPercentage);
    }

    public class BuyCalculationResult
    {
        public decimal GoldValue { get; set; }
        public decimal ManufacturingValue { get; set; }
        public decimal StampValue { get; set; }
        public decimal ExtraFees { get; set; }
        public decimal Total { get; set; }
        public decimal FinalPricePerGram { get; set; }
    }

    public class SellCalculationResult
    {
        public decimal OriginalPricePerGram { get; set; }
        public decimal DiscountPercentage { get; set; }
        public decimal DiscountValuePerGram { get; set; }
        public decimal NetPricePerGram { get; set; }
        public decimal Weight { get; set; }
        public decimal Total { get; set; }
    }
}