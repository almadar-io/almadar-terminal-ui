import React from 'react';
import { Box as InkBox, Text } from 'ink';

export interface CardProps {
  variant?: 'default' | 'bordered' | 'elevated';
  title?: string;
  subtitle?: string;
  padding?: number;
  /** Border color — bare Ink/chalk color or hex, not a theme key (matches
   *  `Box.borderColor`'s convention; resolve theme keys before passing). */
  borderColor?: string;
  children?: React.ReactNode;
}

export function Card({ title, subtitle, padding = 1, borderColor, children }: CardProps): React.ReactElement {
  return (
    <InkBox
      borderStyle="round"
      borderColor={borderColor}
      flexDirection="column"
      paddingLeft={padding}
      paddingRight={padding}
    >
      {title ? <Text bold>{title}</Text> : null}
      {subtitle ? <Text dimColor>{subtitle}</Text> : null}
      {(title || subtitle) && children ? <Text dimColor>{'─'.repeat(30)}</Text> : null}
      {children}
    </InkBox>
  );
}
