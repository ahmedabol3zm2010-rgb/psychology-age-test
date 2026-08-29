export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`mt-8 text-center text-sm text-slate-400 ${className}`}>
      <p>تم تصميم هذا الاختبار لتجربة ممتعة ومبسطة في فهم العمر النفسي.</p>
      <p className="mt-2">الإصدار 1.0.1</p>
    </footer>
  );
}
