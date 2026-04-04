import React from 'react';
import { Text, Box, useStdout } from 'ink';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  variant?: 'solid' | 'dashed' | 'dotted';
}

const chars = { solid: '─', dashed: '╌', dotted: '┈' };

export function Divider({ label, variant = 'solid' }: DividerProps): React.ReactElement {
  const { stdout } = useStdout();
  const width = stdout?.columns ?? 80;
  const ch = chars[variant];

  if (label) {
    const side = Math.max(1, Math.floor((width - label.length - 4) / 2));
    return (
      <Text dimColor>
        {ch.repeat(side)} {label} {ch.repeat(side)}
      </Text>
    );
  }

  return (
    <Box>
      <Text dimColor>{ch.repeat(width)}</Text>
    </Box>
  );
}
