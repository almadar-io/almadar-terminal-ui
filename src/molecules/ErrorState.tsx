import React from 'react';
import { Box as InkBox, Text } from 'ink';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  description?: string;
}

export function ErrorState({ title = 'Error', message, description }: ErrorStateProps): React.ReactElement {
  const text = message ?? description;
  return (
    <InkBox borderStyle="round" borderColor="red" paddingLeft={1} paddingRight={1} flexDirection="column">
      <Text color="red" bold>✗ {title}</Text>
      {text ? <Text>{text}</Text> : null}
    </InkBox>
  );
}
