import React from 'react';
import { Box as InkBox, Text } from 'ink';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  /** Source namespace, e.g. `almadar:runtime:effects`. */
  namespace?: string;
  message: string;
}

export const LEVEL_COLOR: Record<LogLevel, string> = {
  debug: 'gray',
  info: 'cyan',
  warn: 'yellow',
  error: 'red',
};

export const LEVEL_MARK: Record<LogLevel, string> = {
  debug: '·',
  info: 'ℹ',
  warn: '⚠',
  error: '✗',
};

export interface LogLineProps extends LogEntry {
  /** Indent (spaces) for grouping under a parent. Default 0. */
  indent?: number;
}

/**
 * One log entry rendered inline in the body flow: a level mark + colour, a
 * dimmed namespace, then the **full** message soft-wrapped onto continuation
 * lines (`wrap="wrap"` — never truncated). Designed to stream into an ink
 * `<Static>` so each line is written once into terminal scrollback. Use this
 * (not the fixed-height `LogView` panel) when the full log history must remain
 * readable, e.g. examining agent behaviour.
 */
export function LogLine({ level, namespace, message, indent = 0 }: LogLineProps): React.ReactElement {
  const color = LEVEL_COLOR[level];
  // One `<Text wrap="wrap">` with nested colour spans so the mark, namespace,
  // and message flow as a single soft-wrapped paragraph. Separate flex-row
  // `<Text>` children would each wrap into their own column instead.
  return (
    <InkBox marginLeft={indent}>
      <Text wrap="wrap">
        <Text color={color}>{LEVEL_MARK[level]} </Text>
        {namespace ? <Text dimColor>{namespace} </Text> : null}
        <Text color={level === 'warn' || level === 'error' ? color : undefined}>{message}</Text>
      </Text>
    </InkBox>
  );
}
