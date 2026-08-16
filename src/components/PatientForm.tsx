import { ChangeEvent } from 'react';
import type { PatientFormData } from '../types/adhd';

type PatientFormProps = {
  formData: PatientFormData;
  onChange: (field: keyof PatientFormData, value: string | boolean) => void;
  ageText: string;
  ageGroupLabel: string;
  ageStatus: string;
};

export default function PatientForm({ formData, onChange, ageText, ageGroupLabel, ageStatus }: PatientFormProps) {
  const updateField = (field: keyof PatientFormData) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    onChange(field, value as string | boolean);
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-800/80 p-6 shadow-xl shadow-black/20">
      <h2 className="mb-5 text-xl font-semibold text-white">بيانات الفرد</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-slate-200">
          <span className="mb-2 block">اسم الفرد</span>
          <input value={formData.fullName} onChange={updateField('fullName')} className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-slate-200">
          <span className="mb-2 block">الجنس</span>
          <select value={formData.gender} onChange={updateField('gender')} className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-white">
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>
        </label>
        <label className="text-sm text-slate-200 md:col-span-2">
          <span className="mb-2 block">العنوان</span>
          <input value={formData.address} onChange={updateField('address')} className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-slate-200">
          <span className="mb-2 block">تاريخ الميلاد</span>
          <input type="date" value={formData.birthDate} onChange={updateField('birthDate')} className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-slate-200">
          <span className="mb-2 block">تاريخ التقدير</span>
          <input type="date" value={formData.assessmentDate} onChange={updateField('assessmentDate')} className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-slate-200 md:col-span-2">
          <span className="mb-2 block">اسم الفاحص</span>
          <input value={formData.examinerName} onChange={updateField('examinerName')} className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-white" />
        </label>
        <label className="text-sm text-slate-200 md:col-span-2">
          <span className="mb-2 block">وظيفة الفاحص</span>
          <input value={formData.examinerRole} onChange={updateField('examinerRole')} list="examinerRoles" className="w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-white" />
          <datalist id="examinerRoles">
            <option value="أخصائي نفسي" />
            <option value="أخصائي تخاطب" />
            <option value="معلم تربية خاصة" />
            <option value="أخصائي اجتماعي" />
            <option value="طبيب نفسي" />
            <option value="أخرى" />
          </datalist>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-200 md:col-span-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-3">
          <input type="checkbox" checked={formData.reuseExaminer} onChange={updateField('reuseExaminer')} className="h-4 w-4 rounded border-slate-600 bg-slate-800" />
          <span>استخدام نفس بيانات الفاحص للتقرير التالي</span>
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-4 text-sm text-slate-200">
        <p className="font-semibold text-cyan-300">حساب العمر التقديري</p>
        <div className="mt-3 rounded-xl border border-slate-700 bg-slate-950/60 p-3">
          <p className="text-2xl font-bold text-white">{ageText}</p>
          <p className="mt-2 text-slate-400">الفئة العمرية: {ageGroupLabel}</p>
          <p className="mt-1 text-slate-400">الحالة: {ageStatus}</p>
        </div>
      </div>
    </section>
  );
}
