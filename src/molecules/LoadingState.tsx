import React from 'react';
import { Box, Text } from 'ink';
import InkSpinner from 'ink-spinner';

export interface LoadingStateProps {
  title?: string;
  message?: string;
}

export function LoadingState({ title, message }: LoadingStateProps): React.ReactElement {
  const text = message ?? title ?? 'Loading...';
  return (
    <Box gap={1}>
      <Text color="cyan"><InkSpinner type="dots" /></Text>
      <Text>{text}</Text>
    </Box>
  );
}
