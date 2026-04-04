import React from 'react';
import { Box, Text } from 'ink';

export interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({ label, required, error, hint, children }: FormFieldProps): React.ReactElement {
  return (
    <Box flexDirection="column">
      <Box>
        <Text bold>{label}</Text>
        {required ? <Text color="red"> *</Text> : null}
      </Box>
      {hint ? <Text dimColor>{hint}</Text> : null}
      {children}
      {error ? <Text color="red">{error}</Text> : null}
    </Box>
  );
}
