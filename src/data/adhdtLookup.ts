import norms from '../../adhdt_male_norms.json';
import adhdRates from '../../adhdt_male_adhd_rates.json';
import percentiles from '../../adhdt_male_percentiles.json';

export type ScaleKey = 'hyperactivity' | 'impulsivity' | 'inattention' | 'total';

export interface LookupResult {
  ageGroup: '3-7' | '8-23' | 'outOfRange';
  standardScore: number | null;
  message: string;
}

export interface InterpretationResult {
  disorderRatio: string;
  status: string;
}

function getAgeGroupFromAge(ageYears: number | null): '3-7' | '8-23' | 'outOfRange' {
  if (ageYears === null) return 'outOfRange';
  if (ageYears >= 3 && ageYears < 8) return '3-7';
  if (ageYears >= 8 && ageYears <= 23) return '8-23';
  return 'outOfRange';
}

export function getInterpretation(standardScore: number): InterpretationResult {
  if (standardScore >= 15) {
    return {
      disorderRatio: '121 فأكثر',
      status: 'مرتفع',
    };
  }
  if (standardScore >= 13 && standardScore < 15) {
    return {
      disorderRatio: '111-120',
      status: 'فوق المتوسط',
    };
  }
  if (standardScore >= 8 && standardScore < 13) {
    return {
      disorderRatio: '90-110',
      status: 'متوسط',
    };
  }
  if (standardScore >= 6 && standardScore < 8) {
    return {
      disorderRatio: '80-89',
      status: 'أقل من المتوسط',
    };
  }
  return {
    disorderRatio: '79 فأقل',
    status: 'منخفض',
  };
}

export function lookupStandardScore(rawScore: number | '', ageYears: number | null, scale: ScaleKey): LookupResult {
  if (rawScore === '' || rawScore === null) {
    return { ageGroup: 'outOfRange', standardScore: null, message: 'أدخل درجة خام أولًا.' };
  }

  const ageGroup = getAgeGroupFromAge(ageYears);
  if (ageGroup === 'outOfRange') {
    return { ageGroup, standardScore: null, message: 'خارج النطاق العمري للاختبار.' };
  }

  const scaleTable = norms.ageGroups[ageGroup][scale] as Record<string, number>;
  const normalized = String(rawScore);

  if (scale === 'hyperactivity' || scale === 'impulsivity') {
    if (rawScore >= 21 && rawScore <= 36) {
      return {
        ageGroup,
        standardScore: null,
        message: 'لا توجد درجة معيارية مسجلة لهذه الدرجة الخام في هذا المقياس',
      };
    }
  }

  if (scale === 'inattention' && rawScore >= 27 && rawScore <= 36) {
    return {
      ageGroup,
      standardScore: null,
      message: 'لا توجد درجة معيارية مسجلة لهذه الدرجة الخام في هذا المقياس',
    };
  }

  if (!(normalized in scaleTable)) {
    return {
      ageGroup,
      standardScore: null,
      message: 'لا توجد درجة معيارية مسجلة لهذه الدرجة الخام في هذا المقياس',
    };
  }

  return {
    ageGroup,
    standardScore: scaleTable[normalized],
    message: 'تم العثور على الدرجة المعيارية من جدول ADHD-T.',
  };
}

export function interpretStandardScore(standardScore: number | null): InterpretationResult | null {
  if (standardScore === null) return null;
  return getInterpretation(standardScore);
}

export function lookupADHDRate(rawScore: number | '', ageYears: number | null, scale: ScaleKey): LookupResult {
  if (rawScore === '' || rawScore === null) {
    return { ageGroup: 'outOfRange', standardScore: null, message: 'أدخل درجة خام أولًا.' };
  }

  const ageGroup = getAgeGroupFromAge(ageYears);
  if (ageGroup === 'outOfRange') {
    return { ageGroup, standardScore: null, message: 'خارج النطاق العمري للاختبار.' };
  }

  const scaleTable = adhdRates.ageGroups[ageGroup][scale] as Record<string, number>;
  const normalized = String(rawScore);

  if (scale === 'hyperactivity' || scale === 'impulsivity') {
    if (rawScore >= 21 && rawScore <= 36) {
      return {
        ageGroup,
        standardScore: null,
        message: 'لا توجد درجة معيارية مسجلة لهذه الدرجة الخام في هذا المقياس',
      };
    }
  }

  if (scale === 'inattention' && rawScore >= 27 && rawScore <= 36) {
    return {
      ageGroup,
      standardScore: null,
      message: 'لا توجد درجة معيارية مسجلة لهذه الدرجة الخام في هذا المقياس',
    };
  }

  if (!(normalized in scaleTable)) {
    return {
      ageGroup,
      standardScore: null,
      message: 'لا توجد درجة معيارية مسجلة لهذه الدرجة الخام في هذا المقياس',
    };
  }

  return {
    ageGroup,
    standardScore: scaleTable[normalized],
    message: 'تم العثور على نسبة اضطراب ADHD من جدول ملحق (5).',
  };
}

export function lookupPercentile(rawScore: number | '', ageYears: number | null, scale: ScaleKey): LookupResult {
  if (rawScore === '' || rawScore === null) {
    return { ageGroup: 'outOfRange', standardScore: null, message: 'أدخل درجة خام أولًا.' };
  }

  const ageGroup = getAgeGroupFromAge(ageYears);
  if (ageGroup === 'outOfRange') {
    return { ageGroup, standardScore: null, message: 'خارج النطاق العمري للاختبار.' };
  }

  const scaleTable = percentiles.ageGroups[ageGroup][scale] as Record<string, number>;
  const normalized = String(rawScore);

  if (scale === 'hyperactivity' || scale === 'impulsivity') {
    if (rawScore >= 21 && rawScore <= 36) {
      return {
        ageGroup,
        standardScore: null,
        message: 'لا توجد درجة مئينية مسجلة لهذه الدرجة الخام في هذا المقياس',
      };
    }
  }

  if (scale === 'inattention' && rawScore >= 27 && rawScore <= 36) {
    return {
      ageGroup,
      standardScore: null,
      message: 'لا توجد درجة مئينية مسجلة لهذه الدرجة الخام في هذا المقياس',
    };
  }

  if (!(normalized in scaleTable)) {
    return {
      ageGroup,
      standardScore: null,
      message: 'لا توجد درجة مئينية مسجلة لهذه الدرجة الخام في هذا المقياس',
    };
  }

  return {
    ageGroup,
    standardScore: scaleTable[normalized],
    message: 'تم العثور على الدرجة المئينية من جدول ملحق (3).',
  };
}
