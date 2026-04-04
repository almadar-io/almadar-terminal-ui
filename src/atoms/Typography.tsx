import React from 'react';
import { Text } from 'ink';
import { resolveColor } from '../theme.js';

export interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'overline' | 'small' | 'label';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean;
  content?: React.ReactNode;
  children?: React.ReactNode;
}

export function Typography({ variant = 'body', color, weight, truncate, content, children }: TypographyProps): React.ReactElement {
  const text = children ?? content;
  const isBold = variant === 'h1' || variant === 'h2' || variant === 'h3' || weight === 'bold' || weight === 'semibold';
  const isDim = variant === 'caption' || variant === 'small' || variant === 'overline';
  const isUnderline = variant === 'h1';
  const resolved = resolveColor(color);

  return (
    <Text
      bold={isBold}
      dimColor={isDim}
      underline={isUnderline}
      color={resolved}
      wrap={truncate ? 'truncate' : 'wrap'}
    >
      {text}
    </Text>
  );
}
