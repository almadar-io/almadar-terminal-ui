import React from 'react';
import { Box as InkBox, Text } from 'ink';
import type { ToolArgs, JsonValue } from '@almadar/core';
import { Spinner } from '../atoms/Spinner.js';
import { Badge } from '../atoms/Badge.js';
import { Icon } from '../atoms/Icon.js';
import { resolveColor } from '../theme.js';

/** Best-effort icon per tool, by name substring — falls back to `gear`. Order
 *  matters (checked top-to-bottom); keep specific matches before generic ones. */
const TOOL_ICON_RULES: ReadonlyArray<readonly [RegExp, string]> = [
  [/search|find|ls\b/i, 'circle-dot'],
  [/read|cat\b/i, 'folder'],
  [/write|edit|create/i, 'file'],
  [/delete|remove|archive/i, 'cross'],
  [/valid|verify|lint|check/i, 'check'],
  [/deploy|publish/i, 'bolt'],
  [/done|complete|finish/i, 'check'],
];

function pickToolIcon(tool: string): string {
  for (const [pattern, icon] of TOOL_ICON_RULES) {
    if (pattern.test(tool)) return icon;
  }
  return 'gear';
}

export interface ToolCallCardProps {
  tool: string;
  args?: ToolArgs;
  status: 'running' | 'success' | 'error';
  durationMs?: number;
  result?: JsonValue;
  /** Show full, untruncated args/result JSON instead of the compact
   *  one-line summary — driven by a caller-owned global toggle (e.g. the
   *  CLI's Ctrl+O) so every card expands together. Full detail is also
   *  always available in the caller's log view regardless of this prop. */
  expanded?: boolean;
}

/** One tool-call row — in-flight (spinner + tool icon + arg summary) or
 *  resolved (✓/✗ + duration), with an optional expanded full-detail body. */
export function ToolCallCard({ tool, args, status, durationMs, result, expanded = false }: ToolCallCardProps): React.ReactElement {
  if (status === 'running') {
    const summary = args ? summarizeArgs(args) : '';
    return (
      <InkBox flexDirection="column">
        <InkBox>
          <Spinner />
          <Text> </Text>
          <Icon name={pickToolIcon(tool)} color={resolveColor('primary')} />
          <Text> </Text>
          <Badge variant="info">{tool}</Badge>
          {!expanded && summary ? <Text dimColor>  {summary}</Text> : null}
        </InkBox>
        {expanded && args !== undefined ? <DetailBlock label="args" value={args} /> : null}
      </InkBox>
    );
  }
  const success = status === 'success';
  return (
    <InkBox flexDirection="column">
      <InkBox>
        <Icon name={success ? 'check' : 'cross'} color={resolveColor(success ? 'success' : 'error')} />
        <Text> {tool}</Text>
        {typeof durationMs === 'number' ? <Text dimColor> ({durationMs}ms)</Text> : null}
      </InkBox>
      {expanded && args !== undefined ? <DetailBlock label="args" value={args} /> : null}
      {expanded && result !== undefined ? <DetailBlock label="result" value={result} /> : null}
    </InkBox>
  );
}

function DetailBlock({ label, value }: { label: string; value: unknown }): React.ReactElement {
  const json = (() => {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  })();
  return (
    <InkBox flexDirection="column" marginLeft={2}>
      <Text dimColor>{label}:</Text>
      {json.split('\n').map((line, i) => (
        <Text key={i} dimColor>
          {'  '}
          {line}
        </Text>
      ))}
    </InkBox>
  );
}

function summarizeArgs(args: ToolArgs): string {
  const parts: string[] = [];
  for (const [key, val] of Object.entries(args)) {
    if (typeof val === 'string' && val.length < 40) {
      parts.push(`${key}: ${val}`);
    } else if (typeof val === 'number' || typeof val === 'boolean') {
      parts.push(`${key}: ${val}`);
    }
  }
  return parts.slice(0, 3).join(', ');
}
