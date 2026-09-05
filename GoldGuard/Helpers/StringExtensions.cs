using System.Globalization;

namespace GoldGuard.Helpers
{
    public static class StringExtensions
    {
        public static string FormatCurrency(this decimal value)
        {
            return value.ToString("N2", new CultureInfo("ar-EG")) + " جنيه";
        }

        public static string FormatWeight(this decimal value)
        {
            return value.ToString("N2", new CultureInfo("ar-EG")) + " جرام";
        }

        public static string FormatPercentage(this decimal value)
        {
            return value.ToString("N1", new CultureInfo("ar-EG")) + "%";
        }
    }
}