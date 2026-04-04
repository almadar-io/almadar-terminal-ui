import React from 'react';
import { Box, Text } from 'ink';

export interface DataGridColumn {
  name: string;
  label?: string;
  width?: number;
}

export interface DataGridProps {
  columns: DataGridColumn[];
  rows: Record<string, string | number | boolean>[];
  gap?: 'none' | 'sm' | 'md' | 'lg';
}

export function DataGrid({ columns, rows }: DataGridProps): React.ReactElement {
  const colWidths = columns.map(col => {
    const headerLen = (col.label ?? col.name).length;
    const maxDataLen = rows.reduce((max, row) => {
      const val = String(row[col.name] ?? '');
      return Math.max(max, val.length);
    }, 0);
    return col.width ?? Math.max(headerLen, maxDataLen) + 2;
  });

  return (
    <Box flexDirection="column">
      <Box>
        {columns.map((col, i) => (
          <Box key={col.name} width={colWidths[i]}>
            <Text bold dimColor>{(col.label ?? col.name).padEnd(colWidths[i] ?? 10)}</Text>
          </Box>
        ))}
      </Box>
      {rows.map((row, ri) => (
        <Box key={ri}>
          {columns.map((col, ci) => (
            <Box key={col.name} width={colWidths[ci]}>
              <Text>{String(row[col.name] ?? '').padEnd(colWidths[ci] ?? 10)}</Text>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
