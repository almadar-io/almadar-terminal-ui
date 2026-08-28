import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { AgentResponse } from '../AgentResponse.js';

describe('AgentResponse', () => {
  it('renders inline bold mid-line', () => {
    const { lastFrame } = render(<AgentResponse content="This has **bold text** inside a sentence." />);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('This has');
    expect(frame).toContain('bold text');
    expect(frame).toContain('inside a sentence.');
    expect(frame).not.toContain('**');
  });

  it('renders headings at three levels', () => {
    const { lastFrame } = render(<AgentResponse content={'# H1\n## H2\n### H3\nbody'} />);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('H1');
    expect(frame).toContain('H2');
    expect(frame).toContain('H3');
    expect(frame).not.toContain('#');
  });

  it('renders bullet and numbered lists with glyphs', () => {
    const { lastFrame } = render(<AgentResponse content={'- first\n- second\n1. one\n2. two'} />);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('• first');
    expect(frame).toContain('• second');
    expect(frame).toContain('1. one');
    expect(frame).toContain('2. two');
  });

  it('renders blockquotes with a guide bar', () => {
    const { lastFrame } = render(<AgentResponse content="> a quoted line" />);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('│');
    expect(frame).toContain('a quoted line');
  });

  it('keeps code fences dim and unmodified', () => {
    const { lastFrame } = render(<AgentResponse content={'```\nconst x = 1;\n```'} />);
    const frame = lastFrame() ?? '';
    expect(frame).toContain('```');
    expect(frame).toContain('const x = 1;');
  });
});
