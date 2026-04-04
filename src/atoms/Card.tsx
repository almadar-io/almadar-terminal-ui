import React from 'react';
import { Box as InkBox, Text } from 'ink';

export interface CardProps {
  variant?: 'default' | 'bordered' | 'elevated';
  title?: string;
  subtitle?: string;
  padding?: number;
  children?: React.ReactNode;
}

export function Card({ title, subtitle, padding = 1, children }: CardProps): React.ReactElement {
  return (
    <InkBox
      borderStyle="round"
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
