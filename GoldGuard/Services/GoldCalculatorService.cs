using GoldGuard.Models;

namespace GoldGuard.Services
{
    public class GoldCalculatorService : IGoldCalculatorService
    {
        public decimal CalculateGoldValue(decimal pricePerGram, decimal weight)
        {
            if (pricePerGram < 0 || weight < 0)
                throw new ArgumentException("Price and weight must be non-negative");
            
            return pricePerGram * weight;
        }

        public decimal CalculateManufacturingValue(decimal goldValue, decimal manufacturingPercentage)
        {
            if (goldValue < 0 || manufacturingPercentage < 0)
                throw new ArgumentException("Gold value and manufacturing percentage must be non-negative");
            
            return goldValue * (manufacturingPercentage / 100m);
        }

        public decimal CalculateStampValue(decimal stampFeePerGram, decimal weight)
        {
            if (stampFeePerGram < 0 || weight < 0)
                throw new ArgumentException("Stamp fee and weight must be non-negative");
            
            return stampFeePerGram * weight;
        }

        public decimal CalculateBuyTotal(decimal goldValue, decimal manufacturingValue, decimal stampValue, decimal extraFees = 0)
        {
            if (goldValue < 0 || manufacturingValue < 0 || stampValue < 0 || extraFees < 0)
                throw new ArgumentException("All values must be non-negative");
            
            return goldValue + manufacturingValue + stampValue + extraFees;
        }

        public decimal CalculateSellPriceAfterDiscount(decimal pricePerGram, decimal discountPercentage)
        {
            if (pricePerGram < 0 || discountPercentage < 0)
                throw new ArgumentException("Price and discount percentage must be non-negative");
            
            var discountValue = pricePerGram * (discountPercentage / 100m);
            return pricePerGram - discountValue;
        }

        public decimal CalculateSellTotal(decimal netPricePerGram, decimal weight)
        {
            if (netPricePerGram < 0 || weight < 0)
                throw new ArgumentException("Net price and weight must be non-negative");
            
            return netPricePerGram * weight;
        }

        public BuyCalculationResult CalculateBuy(decimal pricePerGram, decimal weight, decimal manufacturingPercentage, decimal stampFee, decimal extraFees = 0)
        {
            if (pricePerGram <= 0 || weight <= 0)
                throw new ArgumentException("Price per gram and weight must be positive");
            
            if (manufacturingPercentage < 0 || stampFee < 0 || extraFees < 0)
                throw new ArgumentException("Manufacturing, stamp fee, and extra fees must be non-negative");

            var goldValue = CalculateGoldValue(pricePerGram, weight);
            var manufacturingValue = CalculateManufacturingValue(goldValue, manufacturingPercentage);
            var stampValue = CalculateStampValue(stampFee, weight);
            var total = CalculateBuyTotal(goldValue, manufacturingValue, stampValue, extraFees);
            var finalPricePerGram = total / weight;

            return new BuyCalculationResult
            {
                GoldValue = goldValue,
                ManufacturingValue = manufacturingValue,
                StampValue = stampValue,
                ExtraFees = extraFees,
                Total = total,
                FinalPricePerGram = finalPricePerGram
            };
        }

        public SellCalculationResult CalculateSell(decimal pricePerGram, decimal weight, decimal discountPercentage)
        {
            if (pricePerGram <= 0 || weight <= 0)
                throw new ArgumentException("Price per gram and weight must be positive");
            
            if (discountPercentage < 0)
                throw new ArgumentException("Discount percentage must be non-negative");

            var discountValuePerGram = pricePerGram * (discountPercentage / 100m);
            var netPricePerGram = pricePerGram - discountValuePerGram;
            var total = CalculateSellTotal(netPricePerGram, weight);

            return new SellCalculationResult
            {
                OriginalPricePerGram = pricePerGram,
                DiscountPercentage = discountPercentage,
                DiscountValuePerGram = discountValuePerGram,
                NetPricePerGram = netPricePerGram,
                Weight = weight,
                Total = total
            };
        }
    }
}