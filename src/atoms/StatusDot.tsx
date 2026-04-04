import React from 'react';
import { Text, Box } from 'ink';

export interface StatusDotProps {
  status?: 'online' | 'offline' | 'away' | 'busy' | 'warning' | 'critical';
  pulse?: boolean;
  label?: string;
}

const statusColors: Record<string, string> = {
  online: 'green',
  offline: 'gray',
  away: 'yellow',
  busy: 'red',
  warning: 'yellow',
  critical: 'red',
};

export function StatusDot({ status = 'offline', label }: StatusDotProps): React.ReactElement {
  const color = statusColors[status] ?? 'gray';
  return (
    <Box>
      <Text color={color}>●</Text>
      {label ? <Text> {label}</Text> : null}
    </Box>
  );
}
