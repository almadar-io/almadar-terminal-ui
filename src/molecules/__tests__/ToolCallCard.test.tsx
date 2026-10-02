import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { ToolCallCard } from '../ToolCallCard.js';

describe('ToolCallCard', () => {
  it('shows a running tool with a search-style icon and its arguments as sent', () => {
    const { lastFrame } = render(
      <ToolCallCard tool="search_organisms" argsText='{"query":"todo app"}' status="running" />,
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('search_organisms');
    expect(frame).toContain('{"query":"todo app"}');
  });

  it('expanded, a resolved tool shows its full answer text', () => {
    const { lastFrame } = render(<ToolCallCard tool="validate" status="success" resultText='{"errors":[]}' expanded />);
    expect(lastFrame() ?? '').toContain('{"errors":[]}');
  });

  it('control: collapsed, the answer text stays hidden', () => {
    const { lastFrame } = render(<ToolCallCard tool="validate" status="success" resultText='{"errors":[]}' />);
    expect(lastFrame() ?? '').not.toContain('{"errors":[]}');
  });

  it('shows a resolved success with a check mark and duration', () => {
    const { lastFrame } = render(<ToolCallCard tool="validate" status="success" durationMs={42} />);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('✓');
    expect(frame).toContain('validate');
    expect(frame).toContain('(42ms)');
  });

  it('shows a resolved failure with a cross mark', () => {
    const { lastFrame } = render(<ToolCallCard tool="write" status="error" durationMs={5} />);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('✗');
    expect(frame).toContain('write');
  });

  it('omits duration when not given', () => {
    const { lastFrame } = render(<ToolCallCard tool="done" status="success" />);
    expect(lastFrame() ?? '').not.toContain('ms)');
  });

  it('hides full args/result behind the compact summary when not expanded', () => {
    const { lastFrame } = render(
      <ToolCallCard tool="search_organisms" status="success" resultText='{"organisms":["TodoOrganism","CartOrganism"]}' />,
    );
    expect(lastFrame() ?? '').not.toContain('TodoOrganism');
  });

  it('shows full untruncated args and result when expanded', () => {
    const { lastFrame } = render(
      <ToolCallCard
        tool="search_organisms"
        argsText='{"query":"a very specific query string that is definitely longer than forty characters"}'
        status="success"
        resultText='{"organisms":["TodoOrganism","CartOrganism"]}'
        expanded
      />,
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('args:');
    expect(frame).toContain('a very specific query string that is definitely longer than forty characters');
    expect(frame).toContain('result:');
    expect(frame).toContain('TodoOrganism');
    expect(frame).toContain('CartOrganism');
  });

  it('shows full args while running and expanded, even with more than 3 keys', () => {
    const { lastFrame } = render(
      <ToolCallCard
        tool="write"
        argsText='{"a":1,"b":2,"c":3,"d":4,"e":{"nested":true}}'
        status="running"
        expanded
      />,
    );
    const frame = lastFrame() ?? '';
    expect(frame).toContain('"a":1');
    expect(frame).toContain('"d":4');
    expect(frame).toContain('"nested":true');
  });
});
