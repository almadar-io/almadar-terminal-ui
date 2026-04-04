import React from 'react';
import { Text, Box } from 'ink';

export interface SwitchProps {
  checked?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({ checked = false, label, disabled }: SwitchProps): React.ReactElement {
  const color = disabled ? 'gray' : checked ? 'green' : 'red';
  const indicator = checked ? '(●─)' : '(─●)';

  return (
    <Box>
      <Text color={color}>{indicator}</Text>
      {label ? <Text> {label}</Text> : null}
    </Box>
  );
}
