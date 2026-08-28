import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { ConversationView } from '../ConversationView.js';
import type { TraceActivityItem, TraceSubagent } from '@almadar/core';

describe('ConversationView', () => {
  it('returns null (renders nothing) when there is no activity', () => {
    const { lastFrame } = render(<ConversationView rootTimeline={[]} />);
    expect(lastFrame()).toBe('');
  });

  it('renders a running tool call, a resolved one, a message, and a milestone in the root timeline', () => {
    const items: TraceActivityItem[] = [
      { type: 'tool_call', tool: 'search_organisms', args: {}, timestamp: 1, isExecuting: true },
      { type: 'tool_result', tool: 'search_organisms', result: null, success: true, timestamp: 2, durationMs: 10 },
      { type: 'message', role: 'assistant', content: 'Built the todo app.', timestamp: 3 },
      { type: 'milestone', milestone: 'roster set', summary: '1 orbital', timestamp: 4 },
    ];
    const { lastFrame } = render(<ConversationView rootTimeline={items} />);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('search_organisms');
    expect(frame).toContain('✓');
    expect(frame).toContain('Built the todo app.');
    expect(frame).toContain('roster set');
    expect(frame).toContain('1 orbital');
  });

  it('renders a subagent group with tree connectors over its nested timeline', () => {
    const subagents: TraceSubagent[] = [
      {
        id: 'sub-1',
        name: 'TodoOrbital',
        role: 'orbital',
        status: 'complete',
        task: 'build',
        messages: [],
        durationMs: 500,
        timeline: [
          { type: 'tool_call', tool: 'write', args: {}, timestamp: 1, isExecuting: true },
          { type: 'tool_result', tool: 'validate', result: null, success: true, timestamp: 2 },
        ],
      },
    ];
    const { lastFrame } = render(<ConversationView rootTimeline={[]} subagents={subagents} />);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('TodoOrbital');
    expect(frame).toContain('(500ms)');
    expect(frame).toContain('├──');
    expect(frame).toContain('└──');
  });

  it('shows a spinner (not a checkmark) for a running subagent with no duration', () => {
    const subagents: TraceSubagent[] = [
      { id: 'sub-2', name: 'RunningOrbital', role: 'orbital', status: 'running', task: 'build', messages: [] },
    ];
    const { lastFrame } = render(<ConversationView rootTimeline={[]} subagents={subagents} />);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('RunningOrbital');
    expect(frame).not.toContain('ms)');
  });

  it('expandToolCalls threads through to root-level and nested tool-call cards', () => {
    const items: TraceActivityItem[] = [
      { type: 'tool_result', tool: 'search_organisms', result: { hit: 'TodoOrganism' }, success: true, timestamp: 1 },
    ];
    const subagents: TraceSubagent[] = [
      {
        id: 'sub-1',
        name: 'TodoOrbital',
        role: 'orbital',
        status: 'complete',
        task: 'build',
        messages: [],
        timeline: [{ type: 'tool_result', tool: 'validate', result: { errors: [] }, success: true, timestamp: 1 }],
      },
    ];
    const collapsed = render(<ConversationView rootTimeline={items} subagents={subagents} />);
    expect(collapsed.lastFrame() ?? '').not.toContain('TodoOrganism');

    const expanded = render(<ConversationView rootTimeline={items} subagents={subagents} expandToolCalls />);
    const frame = expanded.lastFrame() ?? '';
    expect(frame).toContain('TodoOrganism');
    expect(frame).toContain('"errors": []');
  });
});
