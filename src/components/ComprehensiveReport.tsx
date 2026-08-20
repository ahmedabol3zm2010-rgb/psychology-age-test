import type { ResultRow } from '../types/adhd';

type ComprehensiveReportProps = {
  results: ResultRow[];
  patientName: string;
  ageText: string;
  ageGroupLabel: string;
};

export default function ComprehensiveReport({ results, patientName, ageText, ageGroupLabel }: ComprehensiveReportProps) {
  const generateInterpretation = (row: ResultRow) => {
    if (row.normativeScore === '—' || row.normativeScore === 'غير متوفر') {
      return 'غير متوفر';
    }
    
    const score = parseFloat(row.normativeScore);
    if (score >= 15) return 'فوق المتوسط';
    if (score >= 13 && score < 15) return 'فوق المتوسط';
    if (score >= 8 && score < 13) return 'متوسط';
    if (score >= 6 && score < 8) return 'أقل من المتوسط';
    return 'منخفض';
  };

  const generateRecommendations = (row: ResultRow) => {
    const interpretation = generateInterpretation(row);
    const recommendations: string[] = [];
    
    if (interpretation === 'فوق المتوسط') {
      if (row.measure === 'فرط الحركة') {
        recommendations.push('تنمية القدرة على الاستقرار الحركي');
        recommendations.push('تنمية مهارات الانتباه والتركيز');
      }
      if (row.measure === 'الاندفاع') {
        recommendations.push('تنمية القدرة على ضبط الحالة المزاجية');
        recommendations.push('تنمية القدرة على التفكير قبل التصرف');
      }
      if (row.measure === 'نقص الانتباه') {
        recommendations.push('تنمية مهارات الانتباه والتركيز');
        recommendations.push('تنمية القدرة على التنظيم والتخطيط');
      }
    }
    
    if (interpretation === 'متوسط') {
      recommendations.push('الحفاظ على التدريبات الحالية');
      recommendations.push('متابعة التطور مع مرور الوقت');
    }
    
    return recommendations;
  };

  const chartData = results.map(row => ({
    measure: row.measure,
    rawScore: row.rawScore,
    standardScore: row.normativeScore === '—' ? 0 : parseFloat(row.normativeScore),
    interpretation: generateInterpretation(row)
  }));

  const getMaxScore = () => {
    return Math.max(...chartData.map(d => d.standardScore));
  };

  const getBarWidth = (score: number) => {
    const max = getMaxScore() || 20;
    return Math.min((score / max) * 100, 100);
  };

  const getBarColor = (interpretation: string) => {
    switch (interpretation) {
      case 'فوق المتوسط': return 'bg-red-500';
      case 'متوسط': return 'bg-yellow-500';
      case 'أقل من المتوسط': return 'bg-green-500';
      case 'منخفض': return 'bg-green-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-800/80 shadow-xl shadow-black/20 print-card">
      <div className="bg-slate-900/80 p-4">
        <h2 className="text-xl font-semibold text-white">التقرير الشامل</h2>
        <p className="mt-1 text-sm text-slate-400">تحليل شامل للنتائج مع الملاحظات والتوصيات</p>
      </div>

      <div className="p-6 space-y-6">
        {/* المعلومات الأساسية */}
        <div className="bg-slate-900/50 rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">معلومات الفرد</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">الاسم:</span>
              <span className="text-white mr-2">{patientName || 'غير محدد'}</span>
            </div>
            <div>
              <span className="text-slate-400">العمر:</span>
              <span className="text-white mr-2">{ageText}</span>
            </div>
            <div>
              <span className="text-slate-400">الفئة العمرية:</span>
              <span className="text-white mr-2">{ageGroupLabel}</span>
            </div>
          </div>
        </div>

        {/* جدول النتائج */}
        <div className="bg-slate-900/50 rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">جدول النتائج التفصيلي</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-800/70 text-slate-300">
                <tr>
                  <th className="px-3 py-2">المقياس</th>
                  <th className="px-3 py-2">الدرجة الخام</th>
                  <th className="px-3 py-2">الدرجة المعيارية</th>
                  <th className="px-3 py-2">دليل التفسير</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row, index) => (
                  <tr key={index} className="border-t border-slate-700/50">
                    <td className="px-3 py-2 font-semibold text-white">{row.measure}</td>
                    <td className="px-3 py-2">{row.rawScore || '—'}</td>
                    <td className="px-3 py-2">{row.normativeScore}</td>
                    <td className="px-3 py-2">{generateInterpretation(row)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* الرسم البياني */}
        <div className="bg-slate-900/50 rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">الرسم البياني للنتائج</h3>
          <div className="space-y-3">
            {chartData.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white">{item.measure}</span>
                  <span className="text-slate-400">{item.standardScore}</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getBarColor(item.interpretation)} transition-all duration-500`}
                    style={{ width: `${getBarWidth(item.standardScore)}%` }}
                  />
                </div>
                <div className="text-xs text-slate-400">{item.interpretation}</div>
              </div>
            ))}
          </div>
        </div>

        {/* الملاحظات */}
        <div className="bg-slate-900/50 rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">الملاحظات</h3>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="text-slate-300 font-medium mb-2">حقق الطفل المنحني الطبيعي في:</h4>
              <ul className="list-disc list-inside text-slate-400 space-y-1 mr-4">
                <li>عدم التنظيم</li>
                <li>مشكلات نفس جسمية</li>
                <li>السلوك المضاد للمجتمع</li>
                <li>فرط النشاط</li>
                <li>عدم النضج</li>
              </ul>
            </div>
            
            {results.some(row => generateInterpretation(row) === 'فوق المتوسط') && (
              <div>
                <h4 className="text-slate-300 font-medium mb-2">حقق الطفل داخل المنحني ما يفوق المتوسط و بدرجة كبيرة في:</h4>
                <ul className="list-disc list-inside text-slate-400 space-y-1 mr-4">
                  {results.filter(row => generateInterpretation(row) === 'فوق المتوسط').map((row, index) => (
                    <li key={index}>{row.measure}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* التوصيات */}
        <div className="bg-slate-900/50 rounded-2xl p-4">
          <h3 className="text-lg font-semibold text-white mb-3">التوصيات</h3>
          <div className="space-y-2 text-sm">
            <h4 className="text-slate-300 font-medium">يحتاج الطفل إلى:</h4>
            <ul className="list-disc list-inside text-slate-400 space-y-1 mr-4">
              {results.flatMap(row => generateRecommendations(row)).map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
              <li>تنمية القدرة على تحري الصدق</li>
              <li>تنمية القدرة على فهم وضبط المشاعر</li>
              <li>تنمية القدرة على التنظيم والتخطيط</li>
              <li>تنمية مهارات الانتباه والتركيز</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}