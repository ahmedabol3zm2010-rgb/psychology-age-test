import norms from '../../adhdt_male_norms.json' with { type: 'json' };
import adhdRates from '../../adhdt_male_adhd_rates.json' with { type: 'json' };
import percentiles from '../../adhdt_male_percentiles.json' with { type: 'json' };

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

  let standardScore: number | null = null;

  if (scale === 'total') {
    // Total scale uses raw scores 0-72
    if (rawScore < 0 || rawScore > 72) {
      return {
        ageGroup,
        standardScore: null,
        message: 'الدرجة الخام المدخلة خارج نطاق جدول المعايير لهذا المقياس.',
      };
    }

    // First check subScales for 0-36
    if (rawScore <= 36) {
      const subRow = norms.subScales.find(row => row.raw === rawScore);
      if (subRow && subRow.total) {
        standardScore = subRow.total[ageGroup];
      }
    } else {
      // Check totalScale for 37-72
      const totalRow = norms.totalScale.find(row => row.raw === rawScore);
      if (totalRow) {
        standardScore = totalRow.total[ageGroup];
      }
    }
  } else {
    // Sub scales use raw scores 0-26
    if (rawScore < 0 || rawScore > 26) {
      return {
        ageGroup,
        standardScore: null,
        message: 'الدرجة الخام المدخلة خارج نطاق جدول المعايير لهذا المقياس.',
      };
    }

    const subRow = norms.subScales.find(row => row.raw === rawScore);
    if (!subRow) {
      return {
        ageGroup,
        standardScore: null,
        message: 'لا توجد درجة معيارية لهذه الدرجة الخام في جدول ADHDT للذكور.',
      };
    }

    standardScore = subRow[scale][ageGroup];
  }

  if (standardScore === null || standardScore === undefined) {
    return {
      ageGroup,
      standardScore: null,
      message: 'لا توجد درجة معيارية لهذه الدرجة الخام في جدول ADHDT للذكور.',
    };
  }

  return {
    ageGroup,
    standardScore: standardScore,
    message: 'تم العثور على الدرجة المعيارية من جدول ADHDT للذكور.',
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

  let adhdRate: number | null = null;

  if (scale === 'total') {
    // Total scale uses raw scores 0-72
    if (rawScore < 0 || rawScore > 72) {
      return {
        ageGroup,
        standardScore: null,
        message: 'الدرجة الخام المدخلة خارج نطاق جدول المعايير لهذا المقياس.',
      };
    }

    // First check subScales for 0-36
    if (rawScore <= 36) {
      const subRow = adhdRates.subScales.find(row => row.raw === rawScore);
      if (subRow && subRow.total) {
        adhdRate = subRow.total[ageGroup];
      }
    } else {
      // Check totalScale for 37-72
      const totalRow = adhdRates.totalScale.find(row => row.raw === rawScore);
      if (totalRow) {
        adhdRate = totalRow.total[ageGroup];
      }
    }
  } else {
    // Sub scales use raw scores 0-26
    if (rawScore < 0 || rawScore > 26) {
      return {
        ageGroup,
        standardScore: null,
        message: 'الدرجة الخام المدخلة خارج نطاق جدول المعايير لهذا المقياس.',
      };
    }

    const subRow = adhdRates.subScales.find(row => row.raw === rawScore);
    if (!subRow) {
      return {
        ageGroup,
        standardScore: null,
        message: 'لا توجد نسبة اضطراب لهذه الدرجة الخام في جدول ADHDT للذكور.',
      };
    }

    adhdRate = subRow[scale][ageGroup];
  }

  if (adhdRate === null || adhdRate === undefined) {
    return {
      ageGroup,
      standardScore: null,
      message: 'لا توجد نسبة اضطراب لهذه الدرجة الخام في جدول ADHDT للذكور.',
    };
  }

  return {
    ageGroup,
    standardScore: adhdRate,
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

  let percentile: number | null = null;

  if (scale === 'total') {
    // Total scale uses raw scores 0-72
    if (rawScore < 0 || rawScore > 72) {
      return {
        ageGroup,
        standardScore: null,
        message: 'الدرجة الخام المدخلة خارج نطاق جدول المعايير لهذا المقياس.',
      };
    }

    // First check subScales for 0-36
    if (rawScore <= 36) {
      const subRow = percentiles.subScales.find(row => row.raw === rawScore);
      if (subRow && subRow.total) {
        percentile = subRow.total[ageGroup];
      }
    } else {
      // Check totalScale for 37-72
      const totalRow = percentiles.totalScale.find(row => row.raw === rawScore);
      if (totalRow) {
        percentile = totalRow.total[ageGroup];
      }
    }
  } else {
    // Sub scales use raw scores 0-26
    if (rawScore < 0 || rawScore > 26) {
      return {
        ageGroup,
        standardScore: null,
        message: 'الدرجة الخام المدخلة خارج نطاق جدول المعايير لهذا المقياس.',
      };
    }

    const subRow = percentiles.subScales.find(row => row.raw === rawScore);
    if (!subRow) {
      return {
        ageGroup,
        standardScore: null,
        message: 'لا توجد درجة مئينية لهذه الدرجة الخام في جدول ADHDT للذكور.',
      };
    }

    percentile = subRow[scale][ageGroup];
  }

  if (percentile === null || percentile === undefined) {
    return {
      ageGroup,
      standardScore: null,
      message: 'لا توجد درجة مئينية لهذه الدرجة الخام في جدول ADHDT للذكور.',
    };
  }

  return {
    ageGroup,
    standardScore: percentile,
    message: 'تم العثور على الدرجة المئينية من جدول ADHDT للذكور.',
  };
}
