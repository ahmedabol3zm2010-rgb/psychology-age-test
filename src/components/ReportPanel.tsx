import type { PatientFormData, ResultRow } from '../types/adhd';

type ReportPanelProps = {
  patient: PatientFormData;
  ageText: string;
  rows: ResultRow[];
  ageGroupLabel: string;
  ageStatus: string;
  helperText?: string;
  reviewMessage?: string;
  reviewApproved: boolean;
  canPrint: boolean;
  onCalculate: () => void;
  onReset: () => void;
  onApproveReview: () => void;
  onPrint: () => void;
};

export default function ReportPanel({ patient, ageText, rows, ageGroupLabel, ageStatus, helperText, reviewMessage, reviewApproved, canPrint, onCalculate, onReset, onApproveReview, onPrint }: ReportPanelProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-800/80 p-6 shadow-xl shadow-black/20 print-card">
      <h2 className="mb-5 text-xl font-semibold text-white">التقرير النهائي</h2>
      <div className="mb-4 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-sm text-cyan-100">
        <p className="font-semibold">اختبار ADHD-T</p>
        <p className="mt-1">إصدار مختصر من التقرير مع ملخص النتائج الأساسية</p>
      </div>
      <div className="mb-5 rounded-2xl border border-slate-700 bg-slate-900/70 p-4 text-sm text-slate-200">
        <p className="font-semibold text-cyan-300">بيانات الفرد</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <p>الاسم: {patient.fullName || '—'}</p>
          <p>الجنس: {patient.gender}</p>
          <p>العنوان: {patient.address || '—'}</p>
          <p>تاريخ الميلاد: {patient.birthDate || '—'}</p>
          <p>العمر: {ageText}</p>
          <p>تاريخ التقدير: {patient.assessmentDate || '—'}</p>
          <p className="sm:col-span-2">الفاحص: {patient.examinerName || '—'} — {patient.examinerRole || '—'}</p>
        </div>
        <div className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-500/10 p-3 text-slate-100">
          <p className="font-semibold text-cyan-300">الفئة العمرية</p>
          <p className="mt-1">{ageGroupLabel}</p>
          <p className="mt-1 text-slate-300">{ageStatus}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={onCalculate} className="rounded-2xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950">حساب النتيجة</button>
        <button onClick={onApproveReview} disabled={!reviewMessage || reviewApproved} className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-semibold text-emerald-200 disabled:cursor-not-allowed disabled:opacity-50">{reviewApproved ? 'تم اعتماد المراجعة' : 'اعتماد المراجعة'}</button>
        <button onClick={onReset} className="rounded-2xl border border-slate-600 bg-slate-900/70 px-4 py-2 font-semibold text-slate-100">مسح البيانات</button>
        <button onClick={onPrint} disabled={!canPrint} className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 font-semibold text-amber-200 disabled:cursor-not-allowed disabled:opacity-50">طباعة التقرير</button>
      </div>

      {helperText ? <p className="mt-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{helperText}</p> : null}
      {reviewMessage ? <p className="mt-3 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{reviewMessage}</p> : null}

      <div className="mt-5 text-sm text-slate-300">
        <p className="font-semibold text-white">ملخص الدرجات</p>
        {rows.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {rows.map((row) => (
              <li key={row.measure} className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                <span className="font-semibold text-cyan-300">{row.measure}</span>: {row.rawScore} / {row.normativeScore} / {row.adhdRate} / {row.percentileScore} / {row.status}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 rounded-xl border border-dashed border-slate-700 p-3 text-slate-400">لم يتم حساب النتائج بعد. اضغط على “حساب النتيجة” لعرض الملخص.</p>
        )}
      </div>
    </section>
  );
}
