import React from 'react';
import { Box as InkBox, Text } from 'ink';
import { useTerminalWidth } from '../hooks/useTerminalWidth.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  /** Source namespace, e.g. `almadar:rabit:runtime`. */
  namespace?: string;
  message: string;
}

export interface LogViewProps {
  /** Captured log lines, most-recent last. Only the last `rows` are shown. */
  entries: LogEntry[];
  /** Fixed number of rows — keeps the panel a constant height so the terminal
   *  doesn't scroll as new logs stream in. Default 10. */
  rows?: number;
  /** Panel title. Default `logs`. */
  title?: string;
}

const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: 'gray',
  info: 'cyan',
  warn: 'yellow',
  error: 'red',
};

const LEVEL_MARK: Record<LogLevel, string> = {
  debug: '·',
  info: 'ℹ',
  warn: '⚠',
  error: '✗',
};

/**
 * A bordered, fixed-height log panel. Renders the last `rows` entries (padded
 * with blanks so the height never changes), level-coloured, namespace dimmed,
 * width-clipped so lines never wrap. The constant height is deliberate: a
 * streaming log that re-renders in place doesn't push the terminal scrollback.
 */
export function LogView({ entries, rows = 10, title = 'logs' }: LogViewProps): React.ReactElement {
  const width = useTerminalWidth();
  const inner = Math.max(20, width - 4);
  const recent = entries.slice(-rows);
  const padded: Array<LogEntry | null> = [
    ...Array.from({ length: Math.max(0, rows - recent.length) }, () => null),
    ...recent,
  ];
  return (
    <InkBox borderStyle="round" borderColor="gray" flexDirection="column" paddingLeft={1} paddingRight={1}>
      <Text dimColor bold>{title} ({entries.length})</Text>
      {padded.map((entry, i) => (
        <LogRow key={i} entry={entry} width={inner} />
      ))}
    </InkBox>
  );
}

function LogRow({ entry, width }: { entry: LogEntry | null; width: number }): React.ReactElement {
  if (!entry) return <Text> </Text>;
  const color = LEVEL_COLOR[entry.level];
  const ns = entry.namespace ?? '';
  const msgWidth = Math.max(4, width - (ns.length + 3));
  const msg = entry.message.length > msgWidth ? entry.message.slice(0, msgWidth - 1) + '…' : entry.message;
  return (
    <Text wrap="truncate-end">
      <Text color={color}>{LEVEL_MARK[entry.level]} </Text>
      {ns ? <Text dimColor>{ns} </Text> : null}
      <Text color={color}>{msg}</Text>
    </Text>
  );
}
