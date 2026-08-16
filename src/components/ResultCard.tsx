type ResultCardProps = {
  psychologicalAge: number;
  realAge: number;
  message: string;
  insight: string;
};

export default function ResultCard({ psychologicalAge, realAge, message, insight }: ResultCardProps) {
  const difference = psychologicalAge - realAge;

  return (
    <section className="rounded-3xl border border-emerald-400/20 bg-emerald-500/10 p-7 text-center shadow-2xl shadow-emerald-500/10">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">النتيجة</p>
      <h2 className="mt-3 text-3xl font-bold text-white">العمر النفسي: {psychologicalAge} سنة</h2>
      <p className="mt-3 text-lg text-slate-200">{message}</p>
      <div className="mt-6 rounded-2xl bg-slate-900/70 p-4 text-right text-slate-200">
        <p className="font-semibold text-cyan-300">مقارنة مع العمر الحقيقي</p>
        <p className="mt-2 text-sm leading-7">العمر الحقيقي: {realAge} سنة</p>
        <p className="text-sm leading-7">الفرق: {difference > 0 ? `+${difference}` : difference} سنة</p>
        <p className="mt-3 text-sm leading-7">{insight}</p>
      </div>
    </section>
  );
}
