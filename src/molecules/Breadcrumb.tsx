import React from 'react';
import { Box, Text } from 'ink';

export interface BreadcrumbItem {
  label: string;
  isCurrent?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
}

export function Breadcrumb({ items, separator = ' > ' }: BreadcrumbProps): React.ReactElement {
  return (
    <Box>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <Text dimColor>{separator}</Text> : null}
          <Text bold={item.isCurrent} dimColor={!item.isCurrent && i < items.length - 1}>
            {item.label}
          </Text>
        </React.Fragment>
      ))}
    </Box>
  );
}
