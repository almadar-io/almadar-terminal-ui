import React from 'react';
import { Box } from 'ink';

export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';
}

const sizeMap: Record<string, number> = {
  xs: 0, sm: 0, md: 1, lg: 1, xl: 2, '2xl': 3, auto: 1,
};

export function Spacer({ size = 'auto' }: SpacerProps): React.ReactElement {
  if (size === 'auto') {
    return <Box flexGrow={1} />;
  }
  const height = sizeMap[size] ?? 1;
  return <Box height={height} />;
}
