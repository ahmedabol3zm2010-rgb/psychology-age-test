export interface ConnersDataPoint {
  label: string;
  tScore: number;
  classification: 'مرتفع جداً' | 'مرتفع' | 'فوق المتوسط' | 'متوسط' | 'أقل من المتوسط' | 'منخفض';
}

export const sampleConnersData: ConnersDataPoint[] = [
  { label: 'القلق والخجل', tScore: 74, classification: 'مرتفع جداً' },
  { label: 'السلوك المناقضي الاجتماعي', tScore: 51, classification: 'متوسط' },
  { label: 'المشاكل المعرفية', tScore: 64, classification: 'فوق المتوسط' },
  { label: 'المشاكل الجسدية', tScore: 42, classification: 'أقل من المتوسط' },
  { label: 'السلوك الاندفاعي', tScore: 61, classification: 'فوق المتوسط' },
  { label: 'التوتر / الانفعال', tScore: 38, classification: 'أقل من المتوسط' },
  { label: 'مؤشر ADHD', tScore: 72, classification: 'مرتفع جداً' },
  { label: 'سلوك النشاط الزائد', tScore: 40, classification: 'أقل من المتوسط' },
  { label: 'المشاكل الاجتماعية', tScore: 54, classification: 'متوسط' },
];
