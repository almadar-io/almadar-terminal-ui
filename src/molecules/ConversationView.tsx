import React from 'react';
import { Box as InkBox, Text } from 'ink';
import type { TraceActivityItem, TraceSubagent } from '@almadar/core';
import { Badge } from '../atoms/Badge.js';
import { Spinner } from '../atoms/Spinner.js';
import { Icon } from '../atoms/Icon.js';
import { resolveColor } from '../theme.js';
import { AgentResponse } from './AgentResponse.js';
import { ToolCallCard } from './ToolCallCard.js';

export interface ConversationViewProps {
  /** The main/root agent's activity, in order. */
  rootTimeline: ReadonlyArray<TraceActivityItem>;
  /** Nested subagents, each with its own `timeline` (best-effort — see
   *  `TraceSubagent.timeline`'s doc comment in agent-trace-view.ts). */
  subagents?: ReadonlyArray<TraceSubagent>;
  /** Extra content appended to a subagent's header row (e.g. a caller-owned
   *  discovery hint) — an escape hatch so callers don't need to fork this
   *  component for one extra badge. */
  renderSubagentExtra?: (agent: TraceSubagent) => React.ReactNode;
  /** Show full, untruncated args/result on every tool-call card instead of
   *  the compact one-line summary — a single global toggle (e.g. the
   *  caller's Ctrl+O), not per-card, so the whole view expands together. */
  expandToolCalls?: boolean;
}

/** Renders one turn's activity: the root timeline (messages, tool calls,
 *  milestones), then each subagent as a nested, tree-connector-prefixed
 *  group. Framework-agnostic — takes `@almadar/core`'s canonical
 *  `TraceActivityItem`/`TraceSubagent` shapes, not any one runtime's model;
 *  callers (e.g. a rabit-backed CLI) adapt their own conversation model into
 *  these shapes. */
export function ConversationView({ rootTimeline, subagents = [], renderSubagentExtra, expandToolCalls = false }: ConversationViewProps): React.ReactElement | null {
  if (rootTimeline.length === 0 && subagents.length === 0) return null;
  return (
    <InkBox flexDirection="column">
      {rootTimeline.map((item, i) => (
        <ActivityRow key={`r${i}`} item={item} expanded={expandToolCalls} />
      ))}
      {subagents.map((agent) => (
        <SubagentGroup key={agent.id} agent={agent} expanded={expandToolCalls} {...(renderSubagentExtra ? { renderExtra: renderSubagentExtra } : {})} />
      ))}
    </InkBox>
  );
}

function ActivityRow({ item, expanded }: { item: TraceActivityItem; expanded: boolean }): React.ReactElement {
  switch (item.type) {
    case 'message':
      return <AgentResponse content={item.content} />;
    case 'tool_call':
      return <ToolCallCard tool={item.tool} args={item.args} status="running" expanded={expanded} />;
    case 'tool_result':
      return (
        <ToolCallCard
          tool={item.tool}
          status={item.success ? 'success' : 'error'}
          result={item.result}
          expanded={expanded}
          {...(typeof item.durationMs === 'number' ? { durationMs: item.durationMs } : {})}
        />
      );
    case 'milestone':
      return (
        <InkBox>
          <Text color={resolveColor('accent')}>◆ {item.milestone}</Text>
          {item.summary ? <Text dimColor>  {item.summary}</Text> : null}
        </InkBox>
      );
    case 'file_operation':
      return (
        <InkBox>
          <Icon name="file" color={resolveColor('info')} />
          <Text> {item.operation} {item.path}</Text>
        </InkBox>
      );
    case 'error':
      return (
        <InkBox>
          <Icon name="cross" color={resolveColor('error')} />
          <Text color={resolveColor('error')}> {item.message}</Text>
        </InkBox>
      );
    case 'schema_diff':
      return (
        <Text dimColor>
          schema diff: {item.filePath} ({item.hunks.length} hunk{item.hunks.length === 1 ? '' : 's'})
        </Text>
      );
    default:
      return <Text> </Text>;
  }
}

function SubagentGroup({
  agent,
  renderExtra,
  expanded,
}: {
  agent: TraceSubagent;
  renderExtra?: (agent: TraceSubagent) => React.ReactNode;
  expanded: boolean;
}): React.ReactElement {
  const running = agent.status === 'running';
  const badge = running ? 'info' : agent.status === 'error' ? 'error' : 'success';
  const items = agent.timeline ?? [];
  return (
    <InkBox flexDirection="column" marginTop={1}>
      <InkBox>
        {running ? (
          <Spinner />
        ) : (
          <Icon name={agent.status === 'error' ? 'cross' : 'check'} color={resolveColor(agent.status === 'error' ? 'error' : 'success')} />
        )}
        <Text> </Text>
        <Badge variant={badge}>{agent.name}</Badge>
        {typeof agent.durationMs === 'number' ? <Text dimColor> ({agent.durationMs}ms)</Text> : null}
        {renderExtra ? renderExtra(agent) : null}
      </InkBox>
      <InkBox flexDirection="column" marginLeft={2}>
        {items.map((item, i) => (
          <InkBox key={i}>
            <Text dimColor>{i === items.length - 1 ? '└── ' : '├── '}</Text>
            <ActivityRow item={item} expanded={expanded} />
          </InkBox>
        ))}
      </InkBox>
    </InkBox>
  );
}
