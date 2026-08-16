export type Gender = 'ذكر' | 'أنثى';

export type AgeGroup = '3-7' | '8-23' | 'خارج النطاق';

export type MeasureKey = 'hyperactivity' | 'impulsivity' | 'inattention' | 'total';

export type MeasureLabel = 'فرط الحركة' | 'الاندفاع' | 'نقص الانتباه' | 'المجموع';

export interface PatientFormData {
  fullName: string;
  gender: Gender;
  address: string;
  birthDate: string;
  assessmentDate: string;
  examinerName: string;
  examinerRole: string;
  reuseExaminer: boolean;
}

export interface ScoreFormData {
  hyperactivity: number | '';
  impulsivity: number | '';
  inattention: number | '';
  total: number | '';
}

export interface InterpretationData {
  disorderRatio: string;
  status: string;
}

export interface ResultRow {
  measure: MeasureLabel;
  rawScore: number | '';
  normativeScore: string;
  disorderRatio: string;
  status: string;
  adhdRate: string;
  percentileScore: string;
  lookupMessage: string;
}

export interface ReviewRow {
  rowNumber: number;
  label: string;
  value: string;
}
