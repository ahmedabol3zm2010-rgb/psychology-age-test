type QuestionCardProps = {
  question: string;
  options: string[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
};

export default function QuestionCard({ question, options, selectedValue, onSelect }: QuestionCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-800/80 p-6 shadow-xl shadow-black/20">
      <h2 className="mb-5 text-xl font-semibold text-white">{question}</h2>
      <div className="grid gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option;
          return (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`rounded-2xl border px-4 py-3 text-right text-sm font-medium transition ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-700 bg-slate-900/70 text-slate-200 hover:border-cyan-400/60 hover:bg-slate-700/70'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
