import React from 'react';
import { Text, Box } from 'ink';
import { resolveColor } from '../theme.js';

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  label?: string;
  width?: number;
}

export function ProgressBar({ value, max = 100, variant = 'primary', showPercentage, label, width = 20 }: ProgressBarProps): React.ReactElement {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const filled = Math.round((pct / 100) * width);
  const empty = width - filled;
  const color = resolveColor(variant);

  return (
    <Box>
      {label ? <Text>{label} </Text> : null}
      <Text color={color}>{'█'.repeat(filled)}</Text>
      <Text dimColor>{'░'.repeat(empty)}</Text>
      {showPercentage ? <Text> {Math.round(pct)}%</Text> : null}
    </Box>
  );
}
