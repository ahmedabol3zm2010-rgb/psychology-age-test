import { getInterpretation } from './adhdtLookup';

// اختبار حدود نطاقات التفسير
const testCases = [
  // اختبار الحد الأدنى والأعلى لكل فئة
  { score: 5.99, expected: 'منخفض' }, // أقل من 6
  { score: 6.0, expected: 'أقل من المتوسط' }, // >= 6 و < 8
  { score: 7.99, expected: 'أقل من المتوسط' }, // < 8
  { score: 8.0, expected: 'متوسط' }, // >= 8 و < 13
  { score: 12.99, expected: 'متوسط' }, // < 13
  { score: 13.0, expected: 'فوق المتوسط' }, // >= 13 و < 15
  { score: 14.99, expected: 'فوق المتوسط' }, // < 15
  { score: 15.0, expected: 'مرتفع' }, // >= 15
  { score: 20.0, expected: 'مرتفع' }, // >= 15
];

console.log('اختبار حدود نطاقات التفسير:');
console.log('=' .repeat(60));

testCases.forEach(({ score, expected }) => {
  const result = getInterpretation(score);
  const isCorrect = result.status === expected;
  const status = isCorrect ? '✓' : '✗';
  console.log(`${status} Score: ${score.toFixed(2)} → ${result.status} (متوقع: ${expected})`);
  if (!isCorrect) {
    console.log(`   الأقسام: نسبة=${result.disorderRatio}, الحالة=${result.status}`);
  }
});

console.log('=' .repeat(60));
console.log('انتهى الاختبار');
