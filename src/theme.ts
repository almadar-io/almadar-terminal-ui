// Brand hex values, mirrored from almadar/website/src/css/almadar-theme.css's
// dark-mode tokens (the right base for a terminal's dark background). Ink/chalk
// resolve hex identically to named colors, so every existing `resolveColor()`
// call site inherits the real brand identity with no API change.
export const theme = {
  primary: '#14b8a6', // teal — --color-primary (dark)
  secondary: '#1e293b', // --color-secondary (dark)
  success: '#4ade80', // --color-success (dark)
  warning: '#fbbf24', // --color-warning (dark)
  error: '#f87171', // --color-error (dark)
  danger: '#f87171',
  info: '#38bdf8', // --color-info (dark)
  accent: '#d4b44a', // gold — --color-accent (dark)
  muted: 'gray',
  neutral: 'gray',
  default: 'white',
} as const;

export type ThemeColor = keyof typeof theme;

export function resolveColor(variant?: string): string | undefined {
  if (!variant) return undefined;
  return theme[variant as ThemeColor];
}

export const gapSizes: Record<string, number> = {
  none: 0,
  xs: 0,
  sm: 0,
  md: 1,
  lg: 1,
  xl: 2,
  '2xl': 2,
};

export function resolveGap(gap?: string): number {
  if (!gap) return 0;
  return gapSizes[gap] ?? 0;
}
