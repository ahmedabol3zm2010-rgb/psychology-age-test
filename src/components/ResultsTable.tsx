import type { ResultRow } from '../types/adhd';

type ResultsTableProps = {
  rows: ResultRow[];
  reviewApproved: boolean;
};

export default function ResultsTable({ rows, reviewApproved }: ResultsTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-800/80 shadow-xl shadow-black/20 print-card">
      <div className="bg-slate-900/80 p-4">
        <h2 className="text-xl font-semibold text-white">ملخص النتائج المفصل</h2>
        <p className="mt-1 text-sm text-slate-400">جدول النتائج النهائي مع الدرجات المعيارية والتفسيرات</p>
      </div>
      {rows.length > 0 && reviewApproved ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-right text-sm text-slate-200">
            <thead className="bg-slate-900/70 text-slate-300">
              <tr>
                <th className="px-2 py-3 text-xs">المقياس</th>
                <th className="px-2 py-3 text-xs">الخام</th>
                <th className="px-2 py-3 text-xs">المعياري</th>
                <th className="px-2 py-3 text-xs">نسبة اضطراب ADHD</th>
                <th className="px-2 py-3 text-xs">الدرجة المئينية</th>
                <th className="px-2 py-3 text-xs">نسبة الاضطراب</th>
                <th className="px-2 py-3 text-xs">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.measure} className="border-t border-slate-700/70">
                  <td className="px-2 py-3 font-semibold text-white">{row.measure}</td>
                  <td className="px-2 py-3">{row.rawScore ?? '—'}</td>
                  <td className="px-2 py-3">{row.normativeScore}</td>
                  <td className="px-2 py-3">{row.adhdRate}</td>
                  <td className="px-2 py-3">{row.percentileScore}</td>
                  <td className="px-2 py-3">{row.disorderRatio || '—'}</td>
                  <td className="px-2 py-3 text-slate-300">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-sm text-slate-400">في انتظار اعتماد مراجعة القيم قبل عرض النتائج النهائية.</div>
      )}
    </section>
  );
}
