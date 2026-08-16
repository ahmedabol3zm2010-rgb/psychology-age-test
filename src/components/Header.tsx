type HeaderProps = {
  title: string;
  subtitle: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">اختبار نفسي تفاعلي</p>
      <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-300">{subtitle}</p>
    </header>
  );
}
