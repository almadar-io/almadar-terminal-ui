import React from 'react';
import { Text } from 'ink';
import { resolveColor } from '../theme.js';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning' | 'default';
  label?: string;
  isLoading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

export function Button({ variant = 'primary', label, isLoading, disabled, children }: ButtonProps): React.ReactElement {
  const text = children ?? label ?? '';
  const color = disabled ? 'gray' : resolveColor(variant);

  if (isLoading) {
    return <Text color={color}>[...{text}]</Text>;
  }

  return <Text color={color}>[{text}]</Text>;
}
