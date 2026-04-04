import React from 'react';
import { Box } from 'ink';

export interface SimpleGridProps {
  cols?: 1 | 2 | 3 | 4;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function SimpleGrid({ cols = 2, gap = 'md', children }: SimpleGridProps): React.ReactElement {
  const items = React.Children.toArray(children);
  const rows: React.ReactNode[][] = [];

  for (let i = 0; i < items.length; i += cols) {
    rows.push(items.slice(i, i + cols));
  }

  const gapSize = gap === 'none' ? 0 : gap === 'sm' ? 1 : gap === 'lg' ? 3 : 2;

  return (
    <Box flexDirection="column" gap={gapSize}>
      {rows.map((row, ri) => (
        <Box key={ri} gap={gapSize}>
          {row.map((item, ci) => (
            <Box key={ci} flexGrow={1}>
              {item}
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
