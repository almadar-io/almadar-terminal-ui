import React, { useState } from 'react';
import { Box, Text } from 'ink';

export interface AccordionItem {
  id?: string;
  title?: React.ReactNode;
  header?: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  multiple?: boolean;
}

export function Accordion({ items, multiple }: AccordionProps): React.ReactElement {
  const [openItems, setOpenItems] = useState<Set<number>>(() => {
    const initial = new Set<number>();
    items.forEach((item, i) => {
      if (item.defaultOpen) initial.add(i);
    });
    return initial;
  });

  const toggle = (index: number) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!multiple) next.clear();
        next.add(index);
      }
      return next;
    });
  };

  return (
    <Box flexDirection="column">
      {items.map((item, i) => {
        const isOpen = openItems.has(i);
        const label = item.title ?? item.header ?? `Item ${i + 1}`;
        return (
          <Box key={item.id ?? i} flexDirection="column">
            <Text bold>
              {isOpen ? '▼' : '▶'} {label}
            </Text>
            {isOpen ? <Box paddingLeft={2}>{item.content}</Box> : null}
          </Box>
        );
      })}
    </Box>
  );
}
