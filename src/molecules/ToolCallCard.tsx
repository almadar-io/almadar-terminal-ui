import React from 'react';
import { Box as InkBox, Text } from 'ink';
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
  /** The arguments exactly as the agent sent them. */
  argsText?: string;
  status: 'running' | 'success' | 'error';
  durationMs?: number;
  /** The answer exactly as the agent got it back. */
  resultText?: string;
  /** Show the full args/result text below the row instead of the
   *  one-line row — driven by a caller-owned global toggle (e.g. the
   *  CLI's Ctrl+O) so every card expands together. Full detail is also
   *  always available in the caller's log view regardless of this prop. */
  expanded?: boolean;
}

/** One tool-call row — in-flight (spinner + tool icon + arg summary) or
 *  resolved (✓/✗ + duration), with an optional expanded full-detail body. */
export function ToolCallCard({ tool, argsText, status, durationMs, resultText, expanded = false }: ToolCallCardProps): React.ReactElement {
  if (status === 'running') {
    const summary = argsText !== undefined && argsText !== '{}' ? argsText : '';
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
        {expanded && argsText !== undefined ? <DetailBlock label="args" text={argsText} /> : null}
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
      {expanded && argsText !== undefined ? <DetailBlock label="args" text={argsText} /> : null}
      {expanded && resultText !== undefined ? <DetailBlock label="result" text={resultText} /> : null}
    </InkBox>
  );
}

function DetailBlock({ label, text }: { label: string; text: string }): React.ReactElement {
  return (
    <InkBox flexDirection="column" marginLeft={2}>
      <Text dimColor>{label}:</Text>
      {text.split('\n').map((line, i) => (
        <Text key={i} dimColor>
          {'  '}
          {line}
        </Text>
      ))}
    </InkBox>
  );
}
