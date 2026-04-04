import React from 'react';
import { Box } from 'ink';
import { resolveGap } from '../theme.js';

export interface StackProps {
  direction?: 'horizontal' | 'vertical';
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  children?: React.ReactNode;
}

const alignMap: Record<string, 'flex-start' | 'center' | 'flex-end' | 'stretch'> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const justifyMap: Record<string, 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
};

export function Stack({ direction = 'vertical', gap = 'none', align, justify, children }: StackProps): React.ReactElement {
  return (
    <Box
      flexDirection={direction === 'horizontal' ? 'row' : 'column'}
      gap={resolveGap(gap)}
      alignItems={align ? alignMap[align] : undefined}
      justifyContent={justify ? justifyMap[justify] : undefined}
    >
      {children}
    </Box>
  );
}
