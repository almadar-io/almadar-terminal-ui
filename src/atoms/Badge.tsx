import React from 'react';
import { Text } from 'ink';
import { resolveColor } from '../theme.js';

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  children?: React.ReactNode;
}

export function Badge({ variant = 'default', label, children }: BadgeProps): React.ReactElement {
  const text = children ?? label ?? '';
  const color = resolveColor(variant);

  return <Text color={color}>[{text}]</Text>;
}
