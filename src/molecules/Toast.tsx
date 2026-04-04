import React from 'react';
import { Box, Text } from 'ink';
import { resolveColor } from '../theme.js';

export interface ToastProps {
  variant?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  title?: string;
}

const icons: Record<string, string> = {
  success: '✓',
  error: '✗',
  info: 'ℹ',
  warning: '⚠',
};

export function Toast({ variant = 'info', message, title }: ToastProps): React.ReactElement {
  const color = resolveColor(variant);
  const icon = icons[variant];

  return (
    <Box>
      <Text color={color}>{icon} </Text>
      {title ? <Text bold>{title}: </Text> : null}
      <Text>{message}</Text>
    </Box>
  );
}
