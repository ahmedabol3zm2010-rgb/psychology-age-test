export interface ScoreLevel {
  label: string;
  color: string;
}

/**
 * Determines the score level and associated color for a given standard score.
 *
 * Boundaries can be adjusted from this single location.
 * Do NOT duplicate these rules in other files.
 *
 * Levels:
 *   < 60  → "ضمن النطاق المتوقع" (green)
 *   60–69 → "يحتاج إلى متابعة"    (yellow)
 *   70–79 → "مرتفع"              (orange)
 *   ≥ 80  → "مرتفع جدًا"         (red)
 */
export function getScoreLevel(value: number | string | null | undefined): ScoreLevel {
  if (value === null || value === undefined || value === '' || value === '—' || value === 'غير متوفر') {
    return { label: 'غير متاح', color: '#64748b' };
  }

  const score = Number(value);

  if (Number.isNaN(score)) {
    return { label: 'غير متاح', color: '#64748b' };
  }

  if (score < 60) {
    return { label: 'ضمن النطاق المتوقع', color: '#22c55e' };
  }

  if (score < 70) {
    return { label: 'يحتاج إلى متابعة', color: '#eab308' };
  }

  if (score < 80) {
    return { label: 'مرتفع', color: '#f97316' };
  }

  return { label: 'مرتفع جدًا', color: '#ef4444' };
}

/** All available levels for rendering the legend */
export const ALL_LEVELS: ScoreLevel[] = [
  { label: 'ضمن النطاق المتوقع', color: '#22c55e' },
  { label: 'يحتاج إلى متابعة', color: '#eab308' },
  { label: 'مرتفع', color: '#f97316' },
  { label: 'مرتفع جدًا', color: '#ef4444' },
];
