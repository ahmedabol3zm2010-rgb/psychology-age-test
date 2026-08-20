import { getInterpretation } from './adhdtLookup';

// اختبار حدود نطاقات التفسير
const testCases = [
  // اختبار الحد الأدنى والأعلى لكل فئة (7 مستويات)
  { score: 3.99, expected: 'منخفض جداً' }, // < 4
  { score: 4.0, expected: 'منخفض' }, // 4-6
  { score: 6.0, expected: 'منخفض' }, // 4-6
  { score: 7.0, expected: 'أقل من المتوسط' }, // = 7
  { score: 8.0, expected: 'متوسط' }, // 8-12
  { score: 12.0, expected: 'متوسط' }, // 8-12
  { score: 13.0, expected: 'فوق المتوسط' }, // = 13
  { score: 14.0, expected: 'مرتفع' }, // 14-16
  { score: 16.0, expected: 'مرتفع' }, // 14-16
  { score: 17.0, expected: 'مرتفع جداً' }, // >= 17
  { score: 20.0, expected: 'مرتفع جداً' }, // >= 17
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
