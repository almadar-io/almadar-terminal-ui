import React from 'react';
import TextInput from 'ink-text-input';
import { Box, Text } from 'ink';

export interface InputProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function Input({ value = '', placeholder, onChange, onSubmit, error }: InputProps): React.ReactElement {
  return (
    <Box flexDirection="column">
      <Box>
        <Text dimColor>{'> '}</Text>
        <TextInput
          value={value}
          placeholder={placeholder}
          onChange={onChange ?? (() => {})}
          onSubmit={onSubmit}
        />
      </Box>
      {error ? <Text color="red">  {error}</Text> : null}
    </Box>
  );
}
