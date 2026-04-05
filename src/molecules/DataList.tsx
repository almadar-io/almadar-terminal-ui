import React from 'react';
import { Box, Text } from 'ink';

export interface DataListField {
  name: string;
  label?: string;
}

/** Entity row: a record with string keys and display-safe values. */
interface EntityRowData {
  id?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface DataListProps {
  entity: EntityRowData[];
  fields: DataListField[];
  gap?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
}

export function DataList({ entity, fields, variant = 'default' }: DataListProps): React.ReactElement {
  return (
    <Box flexDirection="column" gap={variant === 'compact' ? 0 : 1}>
      {entity.map((item, i) => (
        <Box key={i} flexDirection="column">
          {fields.map(field => (
            <Box key={field.name}>
              <Text dimColor>{(field.label ?? field.name).padEnd(16)}</Text>
              <Text>{String(item[field.name] ?? '')}</Text>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );
}
