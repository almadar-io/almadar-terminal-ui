import React from 'react';
import { Text } from 'ink';

export interface IconProps {
  name?: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ICON_MAP: Record<string, string> = {
  check: '✓',
  cross: '✗',
  spinner: '⧗',
  circle: '●',
  'circle-outline': '○',
  'circle-dot': '◉',
  bolt: '⚡',
  diamond: '◇',
  arrow: '→',
  'arrow-left': '←',
  'arrow-up': '↑',
  'arrow-down': '↓',
  warning: '⚠',
  info: 'ℹ',
  error: '✗',
  star: '★',
  'star-outline': '☆',
  folder: '📁',
  file: '📄',
  lock: '🔒',
  unlock: '🔓',
  gear: '⚙',
  play: '▶',
  pause: '⏸',
  stop: '⏹',
  dot: '·',
  triangle: '▲',
  'triangle-down': '▼',
  'chevron-right': '›',
  'chevron-down': '⌄',
};

export function Icon({ name = 'circle', color }: IconProps): React.ReactElement {
  const symbol = ICON_MAP[name] ?? name;
  return <Text color={color}>{symbol}</Text>;
}
