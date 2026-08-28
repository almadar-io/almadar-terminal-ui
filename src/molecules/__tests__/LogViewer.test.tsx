import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from 'ink-testing-library';
import { LogViewer } from '../LogViewer.js';
import type { LogEntry } from '../LogLine.js';

const ESC = String.fromCharCode(27);
const UP = ESC + '[A';
const DOWN = ESC + '[B';
const PAGE_UP = ESC + '[5~';
const PAGE_DOWN = ESC + '[6~';
const HOME = ESC + '[H';
const END = ESC + '[F';

// ink's stdin-readable listener attaches in a `useEffect` (post-commit) and
// re-renders after a keypress go through the reconciler's own scheduling, so
// a synchronous `stdin.write` right after `render()`/another `write` can race
// ahead of both. A macrotask tick after each is enough in practice.
const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 20));

function makeEntries(n: number): LogEntry[] {
  return Array.from({ length: n }, (_, i) => ({ level: 'info' as const, message: `line ${i}` }));
}

describe('LogViewer', () => {
  it('shows only the last `height` entries while following the tail', async () => {
    const { lastFrame } = render(<LogViewer entries={makeEntries(20)} height={5} />);
    await tick();
    const frame = lastFrame() ?? '';
    expect(frame).toContain('line 19');
    expect(frame).toContain('line 15');
    expect(frame).not.toContain('line 14');
    expect(frame).not.toContain('line 0');
    expect(frame).toContain('following');
  });

  it('scrolls the window up on Up arrow, revealing older lines', async () => {
    const { lastFrame, stdin } = render(<LogViewer entries={makeEntries(20)} height={5} />);
    await tick();
    stdin.write(UP);
    await tick();
    stdin.write(UP);
    await tick();
    const frame = lastFrame() ?? '';
    // Started following at offset 15 (20-5); two Up presses -> offset 13.
    expect(frame).toContain('line 13');
    expect(frame).toContain('line 17');
    expect(frame).not.toContain('line 18');
    expect(frame).not.toContain('following');
  });

  it('resumes auto-follow once scrolled back to the bottom', async () => {
    const { lastFrame, stdin } = render(<LogViewer entries={makeEntries(20)} height={5} />);
    await tick();
    stdin.write(UP);
    await tick();
    expect(lastFrame() ?? '').not.toContain('following');
    stdin.write(DOWN);
    await tick();
    expect(lastFrame() ?? '').toContain('following');
    expect(lastFrame() ?? '').toContain('line 19');
  });

  it('Home jumps to the top, End returns to following the tail', async () => {
    const { lastFrame, stdin } = render(<LogViewer entries={makeEntries(20)} height={5} />);
    await tick();
    stdin.write(HOME);
    await tick();
    let frame = lastFrame() ?? '';
    expect(frame).toContain('line 0');
    expect(frame).not.toContain('following');
    stdin.write(END);
    await tick();
    frame = lastFrame() ?? '';
    expect(frame).toContain('following');
    expect(frame).toContain('line 19');
  });

  it('PageUp/PageDown move by a full viewport height', async () => {
    const { lastFrame, stdin } = render(<LogViewer entries={makeEntries(20)} height={5} />);
    await tick();
    stdin.write(PAGE_UP);
    await tick();
    let frame = lastFrame() ?? '';
    // From offset 15, PageUp by height(5) -> offset 10.
    expect(frame).toContain('line 10');
    expect(frame).toContain('line 14');
    stdin.write(PAGE_DOWN);
    await tick();
    frame = lastFrame() ?? '';
    expect(frame).toContain('following');
  });

  it('does not consume scroll keys when isActive is false', async () => {
    const { lastFrame, stdin } = render(<LogViewer entries={makeEntries(20)} height={5} isActive={false} />);
    await tick();
    stdin.write(UP);
    await tick();
    const frame = lastFrame() ?? '';
    expect(frame).toContain('following');
    expect(frame).toContain('line 19');
  });

  it('renders an empty-state message with zero entries', async () => {
    const { lastFrame } = render(<LogViewer entries={[]} height={5} />);
    await tick();
    expect(lastFrame() ?? '').toContain('(empty)');
  });
});
