import { useMemo, useState } from 'react';
import Header from './components/Header';
import PatientForm from './components/PatientForm';
import ScoreForm from './components/ScoreForm';
import ResultsTable from './components/ResultsTable';
import ReportPanel from './components/ReportPanel';
import ComprehensiveReport from './components/ComprehensiveReport';
import Footer from './components/Footer';
import type { AgeGroup, PatientFormData, ReviewRow, ResultRow, ScoreFormData } from './types/adhd';
import { lookupStandardScore, interpretStandardScore, lookupADHDRate, lookupPercentile } from './data/adhdtLookup';

const initialPatient: PatientFormData = {
  fullName: '',
  gender: 'ذكر',
  address: '',
  birthDate: '',
  assessmentDate: '',
  examinerName: '',
  examinerRole: '',
  reuseExaminer: false,
};

const initialScores: ScoreFormData = {
  hyperactivity: '',
  impulsivity: '',
  inattention: '',
  total: '',
};

function calculateAge(birthDate: string, assessmentDate: string) {
  if (!birthDate || !assessmentDate) return null;

  const birth = new Date(`${birthDate}T00:00:00`);
  const assessment = new Date(`${assessmentDate}T00:00:00`);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(assessment.getTime())) return null;
  if (assessment < birth) return null;

  let years = assessment.getFullYear() - birth.getFullYear();
  let months = assessment.getMonth() - birth.getMonth();
  let days = assessment.getDate() - birth.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(assessment.getFullYear(), assessment.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

function getAgeGroup(age: number | null): AgeGroup {
  if (age === null) return 'خارج النطاق';
  if (age >= 3 && age <= 7) return '3-7';
  if (age >= 8 && age <= 23) return '8-23';
  return 'خارج النطاق';
}

function getResultRows(scores: ScoreFormData, ageGroup: AgeGroup, gender: 'ذكر' | 'أنثى', ageYears: number | null): ResultRow[] {
  if (gender === 'أنثى') {
    return [
      {
        measure: 'فرط الحركة',
        rawScore: scores.hyperactivity,
        normativeScore: 'غير متوفر',
        disorderRatio: 'غير متوفر',
        status: 'غير متوفر',
        adhdRate: 'غير متوفر',
        percentileScore: 'غير متوفر',
        lookupMessage: 'جدول المعايير الخاص بالإناث غير متوفر حاليًا.',
      },
      {
        measure: 'الاندفاع',
        rawScore: scores.impulsivity,
        normativeScore: 'غير متوفر',
        disorderRatio: 'غير متوفر',
        status: 'غير متوفر',
        adhdRate: 'غير متوفر',
        percentileScore: 'غير متوفر',
        lookupMessage: 'جدول المعايير الخاص بالإناث غير متوفر حاليًا.',
      },
      {
        measure: 'نقص الانتباه',
        rawScore: scores.inattention,
        normativeScore: 'غير متوفر',
        disorderRatio: 'غير متوفر',
        status: 'غير متوفر',
        adhdRate: 'غير متوفر',
        percentileScore: 'غير متوفر',
        lookupMessage: 'جدول المعايير الخاص بالإناث غير متوفر حاليًا.',
      },
      {
        measure: 'المجموع',
        rawScore: scores.total,
        normativeScore: 'غير متوفر',
        disorderRatio: 'غير متوفر',
        status: 'غير متوفر',
        adhdRate: 'غير متوفر',
        percentileScore: 'غير متوفر',
        lookupMessage: 'جدول المعايير الخاص بالإناث غير متوفر حاليًا.',
      },
    ];
  }

  if (ageGroup === 'خارج النطاق') {
    return [
      {
        measure: 'فرط الحركة',
        rawScore: scores.hyperactivity,
        normativeScore: '—',
        disorderRatio: '—',
        status: '—',
        adhdRate: '—',
        percentileScore: '—',
        lookupMessage: 'خارج النطاق العمري للاختبار.',
      },
      {
        measure: 'الاندفاع',
        rawScore: scores.impulsivity,
        normativeScore: '—',
        disorderRatio: '—',
        status: '—',
        adhdRate: '—',
        percentileScore: '—',
        lookupMessage: 'خارج النطاق العمري للاختبار.',
      },
      {
        measure: 'نقص الانتباه',
        rawScore: scores.inattention,
        normativeScore: '—',
        disorderRatio: '—',
        status: '—',
        adhdRate: '—',
        percentileScore: '—',
        lookupMessage: 'خارج النطاق العمري للاختبار.',
      },
      {
        measure: 'المجموع',
        rawScore: scores.total,
        normativeScore: '—',
        disorderRatio: '—',
        status: '—',
        adhdRate: '—',
        percentileScore: '—',
        lookupMessage: 'خارج النطاق العمري للاختبار.',
      },
    ];
  }

  const measures: Array<{ key: 'hyperactivity' | 'impulsivity' | 'inattention' | 'total'; measure: 'فرط الحركة' | 'الاندفاع' | 'نقص الانتباه' | 'المجموع' }> = [
    { key: 'hyperactivity', measure: 'فرط الحركة' },
    { key: 'impulsivity', measure: 'الاندفاع' },
    { key: 'inattention', measure: 'نقص الانتباه' },
    { key: 'total', measure: 'المجموع' },
  ];

  const h = typeof scores.hyperactivity === 'number' ? scores.hyperactivity : null;
  const i = typeof scores.impulsivity === 'number' ? scores.impulsivity : null;
  const n = typeof scores.inattention === 'number' ? scores.inattention : null;
  const rawTotal = (h !== null && i !== null && n !== null) ? h + i + n : null;

  return measures.map(({ key, measure }) => {
    let rawScore: number | '';
    let lookupMessage = '';

    if (key === 'total') {
      rawScore = rawTotal ?? '';
      if (rawTotal === null) {
        lookupMessage = 'أكمل إدخال المقاييس الثلاثة لحساب المجموع';
      } else if (rawTotal > 72) {
        lookupMessage = 'الدرجة الخام للمجموع تجاوزت الحد الأقصى للجدول (72)';
      }
    } else {
      rawScore = scores[key];
      lookupMessage = '';
    }

    const lookup = lookupMessage
      ? { ageGroup: ageGroup as '3-7' | '8-23', standardScore: null as number | null, message: lookupMessage }
      : lookupStandardScore(rawScore as number | '', ageYears, key);
    const formattedScore = lookup.standardScore === null ? '—' : lookup.standardScore.toString();

    const adhdLookup = (lookup.standardScore !== null && !lookupMessage)
      ? lookupADHDRate(rawScore as number | '', ageYears, key)
      : { standardScore: null as number | null, message: '' };
    const formattedADHDRate = adhdLookup.standardScore === null ? '—' : adhdLookup.standardScore.toString();

    const percentileLookup = (!lookupMessage)
      ? lookupPercentile(rawScore as number | '', ageYears, key)
      : { standardScore: null as number | null, message: '' };
    const formattedPercentile = percentileLookup.standardScore === null ? '—' : percentileLookup.standardScore.toString();

    let disorderRatio = '—';
    let status = '—';

    if (lookup.standardScore === null) {
      disorderRatio = 'لا توجد بيانات مسجلة لهذه الدرجة الخام';
      status = 'لا توجد بيانات مسجلة لهذه الدرجة الخام';
    } else {
      const interpretation = interpretStandardScore(lookup.standardScore);
      disorderRatio = interpretation?.disorderRatio || '—';
      status = interpretation?.status || '—';
    }

    return {
      measure,
      rawScore: rawScore ?? '',
      normativeScore: formattedScore,
      disorderRatio,
      status,
      adhdRate: formattedADHDRate,
      percentileScore: formattedPercentile,
      lookupMessage: lookup.message,
    };
  });
}

export default function App() {
  const [patient, setPatient] = useState<PatientFormData>(initialPatient);
  const [scores, setScores] = useState<ScoreFormData>(initialScores);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [reviewApproved, setReviewApproved] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('في انتظار مراجعة القيم قبل اعتمادها.');

  const ageData = useMemo(() => calculateAge(patient.birthDate, patient.assessmentDate), [patient.birthDate, patient.assessmentDate]);
  const ageYears = ageData?.years ?? 0;
  const ageGroup = useMemo(() => getAgeGroup(ageYears), [ageYears]);
  const ageText = ageData ? `${ageData.years} سنوات، ${ageData.months} أشهر، ${ageData.days} يومًا` : 'لم يتم إدخال تاريخ الميلاد أو تاريخ التقدير بعد';
  const ageGroupLabel = ageGroup === 'خارج النطاق' ? 'خارج النطاق' : ageGroup === '3-7' ? '3–7 سنوات' : '8–23 سنة';
  const ageStatus = ageGroup === 'خارج النطاق' ? 'العمر خارج نطاق المعايير المتاحة.' : `تم اختيار معايير ${ageGroup === '3-7' ? '3–7 سنوات' : '8–23 سنة'} تلقائيًا.`;

  const handlePatientChange = (field: keyof PatientFormData, value: string | boolean) => {
    setPatient((prev) => ({ ...prev, [field]: value as never }));
  };

  const handleScoreChange = (field: keyof ScoreFormData, value: string) => {
    if (field === 'total') return;
    const nextValue = value === '' ? '' : Number(value);
    const safeValue = Number.isNaN(nextValue) ? '' : nextValue;

    setScores((prev) => ({ ...prev, [field]: safeValue as number | '' }));
  };

  const autoTotal = useMemo(() => {
    const h = typeof scores.hyperactivity === 'number' ? scores.hyperactivity : null;
    const i = typeof scores.impulsivity === 'number' ? scores.impulsivity : null;
    const n = typeof scores.inattention === 'number' ? scores.inattention : null;
    if (h === null || i === null || n === null) return null;
    return h + i + n;
  }, [scores.hyperactivity, scores.impulsivity, scores.inattention]);

  const scoreWarning = useMemo(() => {
    const fields: Array<'hyperactivity' | 'impulsivity' | 'inattention'> = ['hyperactivity', 'impulsivity', 'inattention'];
    for (const field of fields) {
      const value = scores[field];
      if (value === '') {
        return 'أكمل إدخال المقاييس الثلاثة لحساب النتائج.';
      }

      const numericValue = Number(value);
      if (Number.isNaN(numericValue)) {
        return 'أدخل أرقامًا صحيحة فقط في حقول الدرجات الخام.';
      }

      if (numericValue < 0 || numericValue > 36) {
        return 'الدرجات الخام للمقاييس الفرعية يجب أن تكون بين 0 و 36.';
      }
    }

    if (autoTotal !== null && autoTotal > 72) {
      return 'الدرجة الخام للمجموع تجاوزت الحد الأقصى للجدول (72).';
    }

    return '';
  }, [scores, autoTotal]);

  const reviewRows = useMemo<ReviewRow[]>(() => {
    const totalDisplay = autoTotal !== null ? String(autoTotal) : '—';
    const baseRows: ReviewRow[] = [
      { rowNumber: 1, label: 'اسم الفرد', value: patient.fullName || '—' },
      { rowNumber: 2, label: 'تاريخ الميلاد', value: patient.birthDate || '—' },
      { rowNumber: 3, label: 'تاريخ التقدير', value: patient.assessmentDate || '—' },
      { rowNumber: 4, label: 'العمر', value: ageText },
      { rowNumber: 5, label: 'الفئة العمرية', value: ageGroupLabel },
      { rowNumber: 6, label: 'فرط الحركة (Raw)', value: scores.hyperactivity === '' ? '—' : String(scores.hyperactivity) },
      { rowNumber: 7, label: 'الاندفاع (Raw)', value: scores.impulsivity === '' ? '—' : String(scores.impulsivity) },
      { rowNumber: 8, label: 'نقص الانتباه (Raw)', value: scores.inattention === '' ? '—' : String(scores.inattention) },
      { rowNumber: 9, label: 'المجموع (Raw)', value: totalDisplay },
      { rowNumber: 10, label: 'اسم الفاحص', value: patient.examinerName || '—' },
      { rowNumber: 11, label: 'وظيفة الفاحص', value: patient.examinerRole || '—' },
    ];

    return baseRows;
  }, [ageGroupLabel, ageText, autoTotal, patient.birthDate, patient.assessmentDate, patient.examinerName, patient.examinerRole, patient.fullName, scores.hyperactivity, scores.impulsivity, scores.inattention]);

  const calculateResults = () => {
    setResults(getResultRows(scores, ageGroup, patient.gender, ageYears));
    setReviewApproved(false);
    setReviewMessage('تم تحديث القيم. يُرجى مراجعة الجدول ثم اعتماد المراجعة قبل الطباعة.');
  };

  const resetForm = () => {
    setPatient(initialPatient);
    setScores(initialScores);
    setResults([]);
    setReviewApproved(false);
    setReviewMessage('في انتظار مراجعة القيم قبل اعتمادها.');
  };

  const approveReview = () => {
    if (results.length === 0) {
      setReviewMessage('يجب حساب النتائج أولًا قبل اعتماد المراجعة.');
      return;
    }

    if (!patient.examinerName.trim() || !patient.examinerRole.trim()) {
      setReviewMessage('يجب إدخال اسم الفاحص ووظيفته قبل اعتماد المراجعة.');
      return;
    }

    setReviewApproved(true);
    setReviewMessage('تم اعتماد مراجعة القيم بنجاح. أصبح التقرير جاهزًا للطباعة.');
  };

  const printReport = () => {
    if (!reviewApproved || !patient.examinerName.trim() || !patient.examinerRole.trim() || results.length === 0 || ageGroup === 'خارج النطاق' || scoreWarning) {
      setReviewMessage('لا يمكن طباعة التقرير قبل إكمال الحقول الأساسية واعتماد المراجعة.');
      return;
    }
    window.print();
  };

  const canPrint = Boolean(reviewApproved && patient.examinerName.trim() && patient.examinerRole.trim() && results.length > 0 && ageGroup !== 'خارج النطاق' && !scoreWarning);

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 text-right sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <Header
          title="اختبار ADHD-T"
          subtitle="نموذج إدخال وتقييم ذكي لبيانات الفرد والدرجات الخام والنتائج المعيارية."
        />

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <PatientForm
              formData={patient}
              onChange={handlePatientChange}
              ageText={ageText}
              ageGroupLabel={ageGroupLabel}
              ageStatus={ageStatus}
            />
            <ScoreForm scores={scores} onChange={handleScoreChange} helperText={scoreWarning} />
          </div>

          <div className="space-y-6">
            <ReportPanel
              patient={patient}
              ageText={ageText}
              rows={results.length > 0 ? results : []}
              ageGroupLabel={ageGroupLabel}
              ageStatus={ageStatus}
              helperText={scoreWarning}
              reviewMessage={reviewMessage}
              reviewApproved={reviewApproved}
              canPrint={canPrint}
              onCalculate={calculateResults}
              onReset={resetForm}
              onApproveReview={approveReview}
              onPrint={printReport}
            />
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-800/80 shadow-xl shadow-black/20">
          <div className="bg-slate-900/80 p-4">
            <h2 className="text-xl font-semibold text-white">جدول المراجعة</h2>
            <p className="mt-1 text-sm text-slate-400">لا يتم اعتماد أي تقرير فعلي إلا بعد الموافقة الصريحة على هذه القيم.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm text-slate-200">
              <thead className="bg-slate-900/70 text-slate-300">
                <tr>
                  <th className="px-3 py-3">رقم الصف</th>
                  <th className="px-3 py-3">البند</th>
                  <th className="px-3 py-3">القيمة</th>
                </tr>
              </thead>
              <tbody>
                {reviewRows.map((row) => (
                  <tr key={row.label} className="border-t border-slate-700/70">
                    <td className="px-3 py-3">{row.rowNumber}</td>
                    <td className="px-3 py-3 font-semibold text-white">{row.label}</td>
                    <td className="px-3 py-3">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ResultsTable rows={results} reviewApproved={reviewApproved} />
        {reviewApproved && results.length > 0 && (
          <ComprehensiveReport 
            results={results} 
            patientName={patient.fullName}
            ageText={ageText}
            ageGroupLabel={ageGroupLabel}
          />
        )}
        <Footer />
      </div>
    </div>
  );
}
