import React from 'react';
import InkSpinner from 'ink-spinner';
import { Text } from 'ink';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export function Spinner(_props: SpinnerProps): React.ReactElement {
  return (
    <Text>
      <InkSpinner type="dots" />
    </Text>
  );
}
