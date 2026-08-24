import { getInterpretation } from './adhdtLookup';

export interface ScoreLevel {
  label: string;
  color: string;
}

/**
 * Determines the bar color based on standard score (matches C# ADHDT chart).
 *
 * Boundaries:
 *   ≥ 13 → Coral (#ff7f50) — فوق المتوسط فأعلى
 *   < 13 → SteelBlue (#4682b4) — متوسط فأقل
 *
 * The interpretation text comes from getInterpretation() in adhdtLookup.ts
 * so both the chart and the lookup share the same rules.
 */
export function getScoreLevel(value: number | string | null | undefined): ScoreLevel {
  if (value === null || value === undefined || value === '' || value === '—' || value === 'غير متوفر') {
    return { label: 'غير متاح', color: '#64748b' };
  }

  const score = Number(value);

  if (Number.isNaN(score)) {
    return { label: 'غير متاح', color: '#64748b' };
  }

  if (score >= 13) {
    return { label: 'فوق المتوسط', color: '#ff7f50' };
  }

  return { label: 'متوسط', color: '#4682b4' };
}

/** Returns interpretation text and bar color for the chart */
export function getBarLabel(score: number | string | null | undefined): { value: string; interpretation: string; color: string } {
  if (score === null || score === undefined || score === '' || score === '—') {
    return { value: '—', interpretation: 'غير متاح', color: '#64748b' };
  }
  const num = Number(score);
  if (Number.isNaN(num)) {
    return { value: '—', interpretation: 'غير متاح', color: '#64748b' };
  }
  const interp = getInterpretation(num);
  const level = getScoreLevel(num);
  return { value: String(num), interpretation: interp.status, color: level.color };
}

/** All available levels for rendering the legend */
export const ALL_LEVELS: ScoreLevel[] = [
  { label: 'فوق المتوسط (≥ 13)', color: '#ff7f50' },
  { label: 'متوسط (< 13)', color: '#4682b4' },
];
