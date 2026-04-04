import React from 'react';
import { Box as InkBox, Text } from 'ink';
import { resolveColor } from '../theme.js';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message?: string;
  children?: React.ReactNode;
}

const icons: Record<string, string> = {
  info: 'ℹ',
  success: '✓',
  warning: '⚠',
  error: '✗',
};

export function Alert({ variant = 'info', title, message, children }: AlertProps): React.ReactElement {
  const color = resolveColor(variant);
  const icon = icons[variant];

  return (
    <InkBox borderStyle="round" borderColor={color} paddingLeft={1} paddingRight={1} flexDirection="column">
      <Text color={color} bold>{icon} {title ?? variant}</Text>
      {message ? <Text>{message}</Text> : null}
      {children}
    </InkBox>
  );
}
