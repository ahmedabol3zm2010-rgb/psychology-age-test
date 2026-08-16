import type { ScoreFormData } from '../types/adhd';

type ScoreFormProps = {
  scores: ScoreFormData;
  onChange: (field: keyof ScoreFormData, value: string) => void;
  helperText?: string;
};

export default function ScoreForm({ scores, onChange, helperText }: ScoreFormProps) {
  const updateField = (field: 'hyperactivity' | 'impulsivity' | 'inattention') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onChange(field, value);
  };

  const rawTotal = (() => {
    const h = typeof scores.hyperactivity === 'number' ? scores.hyperactivity : null;
    const i = typeof scores.impulsivity === 'number' ? scores.impulsivity : null;
    const n = typeof scores.inattention === 'number' ? scores.inattention : null;
    if (h === null || i === null || n === null) return null;
    return h + i + n;
  })();

  const totalDisplay = rawTotal !== null ? String(rawTotal) : '';
  const totalHelper = rawTotal === null && (scores.hyperactivity === '' || scores.impulsivity === '' || scores.inattention === '')
    ? 'أكمل إدخال المقاييس الثلاثة لحساب المجموع'
    : 'يُحسب تلقائيًا من جمع النشاط الزائد + الاندفاع + نقص الانتباه.';

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-800/80 p-6 shadow-xl shadow-black/20">
      <h2 className="mb-5 text-xl font-semibold text-white">إدخال الدرجات الخام</h2>
      {helperText ? <p className="mb-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">{helperText}</p> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-slate-200">
          <span className="mb-2 block">فرط الحركة / النشاط الزائد</span>
          <input type="number" min="0" max="36" value={scores.hyperactivity} onChange={updateField('hyperactivity')} className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-slate-200">
          <span className="mb-2 block">الاندفاع</span>
          <input type="number" min="0" max="36" value={scores.impulsivity} onChange={updateField('impulsivity')} className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-slate-200">
          <span className="mb-2 block">نقص الانتباه</span>
          <input type="number" min="0" max="36" value={scores.inattention} onChange={updateField('inattention')} className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-slate-200">
          <span className="mb-2 block">المجموع</span>
          <input type="text" readOnly value={totalDisplay} placeholder={rawTotal === null ? '—' : undefined} className="w-full rounded-2xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-slate-400" />
          <p className="mt-2 text-xs text-slate-400">{totalHelper}</p>
        </label>
      </div>
    </section>
  );
}
