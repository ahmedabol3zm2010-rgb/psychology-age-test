# Gold Guard - حارس الذهب

تطبيق احترافي لحساب أسعار الذهب في مصر باستخدام .NET MAUI

## المميزات

- 🥇 حساب أسعار الذهب بدقة للشراء والبيع
- 📊 عرض أسعار الذهب الحالية للعيارات المختلفة (24، 22، 21، 18، 14)
- 🔄 تحديث تلقائي للأسعار (مع دعم Offline)
- 🏪 مقارنة أسعار المحل مع السعر المتوقع
- ⚙️ إعدادات قابلة للتخصيص (مصنعية، دمغة، خصم)
- 📜 سجل العمليات المحفوظة
- 📤 مشاركة النتائج
- 🌐 دعم اللغة العربية (RTL)
- 📱 تصميم عصري وسهل الاستخدام

## المتطلبات

### لتطوير التطبيق:

1. **تثبيت .NET 8.0 SDK**
   - حمل من: https://dotnet.microsoft.com/download/dotnet/8.0
   - اختر SDK وليس Runtime

2. **تثبيت Visual Studio 2022**
   - تأكد من تثبيت workload: ".NET Multi-platform App UI development"

3. **لتطوير Android فقط:**
   - حمل Android Studio
   - تأكد من تثبيت Android SDK

### لتشغيل التطبيق:

- جهاز Android حقيقي أو محاكي
- أو Windows 10/11 (للنسخة Windows)

## التثبيت والتشغيل

### 1. استنساخ المشروع

```bash
cd C:\Users\ALDawlia\psychology-age-test\GoldGuard
```

### 2. استعادة الحزم

```bash
dotnet restore
```

### 3. تشغيل التطبيق

#### على Android:
```bash
dotnet build -t:Run -f net8.0-android
```

#### على Windows:
```bash
dotnet build -t:Run -f net8.0-windows10.0.19041.0
```

#### على محاكي Android:
```bash
dotnet build -t:Run -f net8.0-android
```

## هيكل المشروع

```
GoldGuard/
├── Models/                  # نماذج البيانات
│   ├── GoldPrice.cs
│   ├── Transaction.cs
│   └── AppSettings.cs
├── Services/                # الخدمات
│   ├── IGoldPriceService.cs
│   ├── GoldPriceService.cs
│   ├── IGoldCalculatorService.cs
│   ├── GoldCalculatorService.cs
│   ├── ILocalStorageService.cs
│   └── LocalStorageService.cs
├── Pages/                   # الصفحات
│   ├── MainPage.xaml
│   ├── BuyGoldPage.xaml
│   ├── SellGoldPage.xaml
│   ├── SettingsPage.xaml
│   └── HistoryPage.xaml
├── Data/                    # إدارة البيانات
│   └── TransactionRepository.cs
├── Helpers/                 # مساعدات
│   └── StringExtensions.cs
└── Resources/               # الموارد
    ├── AppIcon/
    ├── Fonts/
    ├── Images/
    └── Raw/
```

## المميزات التقنية

### Architecture
- **MVVM Pattern** لفصل المنطق عن الواجهة
- **Dependency Injection** لإدارة الخدمات
- **Service Layer** لفصل منطق الأعمال
- **Repository Pattern** لإدارة البيانات

### الخدمات
- **GoldPriceService**: إدارة أسعار الذهب والاتصال بالـAPI
- **GoldCalculatorService**: عمليات الحساب المالية بدقة
- **LocalStorageService**: حفظ البيانات محلياً

### الأمان
- استخدام **Decimal** للحسابات المالية بدقة
- معالجة الأخطاء الشاملة
- دعم Offline مع بيانات محفوظة
- فصل مفاتيح API عن الكود

## التخصيص

### تغيير مصدر الأسعار

عدل ملف `GoldPriceService.cs` في دالة `FetchPricesFromApiAsync`:

```csharp
private async Task<List<GoldPrice>> FetchPricesFromApiAsync()
{
    // استبدل هذا بالاتصال الفعلي بالـAPI
    // مثال:
    // var response = await _httpClient.GetAsync("https://api.example.com/gold-prices");
    // var data = await response.Content.ReadAsStringAsync();
    // return ParseGoldPrices(data);
    
    return GetDefaultMockPrices();
}
```

### تعديل القيم الافتراضية

يمكن تعديلها من داخل التطبيق عبر صفحة الإعدادات، أو في الكود:

```csharp
// في AppSettings.cs
public decimal DefaultManufacturingPercentage { get; set; } = 5.0m;
public decimal DefaultSellDiscountPercentage { get; set; } = 2.0m;
public decimal DefaultStampFee { get; set; } = 10.0m;
```

## ملاحظات مهمة

1. **الحسابات المالية**: يتم استخدام `decimal` بدلاً من `double` لضمان الدقة في الحسابات المالية

2. **API Keys**: إذا كنت تستخدم API يتطلب مفتاح، لا تضعه في الكود مباشرة. استخدم Backend وسيط أو متغيرات البيئة

3. **Offline Mode**: التطبيق يعمل بدون إنترنت باستخدام آخر أسعار محفوظة

4. **اللغة**: التطبيق يدعم اللغة العربية بالكامل مع اتجاه RTL

## التطوير المستقبلي

- [ ] إضافة إشعارات لتحديثات الأسعار
- [ ] دعم عملات إضافية
- [ ] رسوم بيانية لتاريخ الأسعار
- [ ] حساب سبائك الذهب
- [ ] حساب جنيهات الذهب
- [ ] مزامنة السحاب
- [ ] إصدار iOS

## الدعم

في حال وجود أي مشاكل أو استفسارات، يرجى فتح Issue في المشروع.

## الترخيص

هذا المشروع مفتوح المصدر للاستخدام الشخصي والتعليمي.

---

**صُنع بـ ❤️ لمساعدة المستخدمين في حساب أسعار الذهب بدقة**