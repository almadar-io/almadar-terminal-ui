import React from 'react';
import { Text, Box } from 'ink';

export interface CheckboxProps {
  checked?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
}

export function Checkbox({ checked = false, label }: CheckboxProps): React.ReactElement {
  return (
    <Box>
      <Text color={checked ? 'green' : 'gray'}>{checked ? '[x]' : '[ ]'}</Text>
      {label ? <Text> {label}</Text> : null}
    </Box>
  );
}
