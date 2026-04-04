import React from 'react';
import { Box, Text } from 'ink';

export interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps): React.ReactElement {
  return (
    <Box flexDirection="column" alignItems="center" paddingTop={1} paddingBottom={1}>
      {icon ? <Text dimColor>{icon}</Text> : null}
      {title ? <Text bold>{title}</Text> : null}
      {description ? <Text dimColor>{description}</Text> : null}
    </Box>
  );
}
