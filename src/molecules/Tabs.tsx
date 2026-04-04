import React from 'react';
import { Box, Text } from 'ink';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
  active?: boolean;
}

export interface TabsProps {
  items?: TabItem[];
  tabs?: TabItem[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({ items, tabs, activeTab }: TabsProps): React.ReactElement {
  const tabList = items ?? tabs ?? [];

  return (
    <Box gap={2}>
      {tabList.map(tab => {
        const isActive = tab.active || tab.id === activeTab;
        return (
          <Box key={tab.id}>
            <Text bold={isActive} underline={isActive} color={isActive ? 'cyan' : undefined} dimColor={!isActive}>
              {tab.label}
            </Text>
            {tab.badge !== undefined ? <Text dimColor> ({tab.badge})</Text> : null}
          </Box>
        );
      })}
    </Box>
  );
}
