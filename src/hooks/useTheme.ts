import { theme, resolveColor } from '../theme.js';
import type { ThemeColor } from '../theme.js';

export function useTheme() {
  return { theme, resolveColor };
}

export type { ThemeColor };
