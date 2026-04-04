export const theme = {
  primary: 'cyan',
  secondary: 'blue',
  success: 'green',
  warning: 'yellow',
  error: 'red',
  danger: 'red',
  info: 'cyan',
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
