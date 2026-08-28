import { describe, it, expect, vi } from 'vitest';
import { render } from 'ink-testing-library';
import { Autocomplete, type AutocompleteItem } from '../Autocomplete.js';

const ESC = String.fromCharCode(27);
const UP = ESC + '[A';
const DOWN = ESC + '[B';
const TAB = '\t';

// Same rationale as LogViewer.test.tsx: ink's stdin listener attaches
// post-commit, so a tick after each write keeps writes from racing renders.
const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 20));

const ITEMS: AutocompleteItem[] = [
  { value: 'help', label: '/help', description: 'List available commands' },
  { value: 'logs', label: '/logs', description: 'Toggle the live log view' },
  { value: 'status', label: '/status', description: 'Show workspace state' },
];

describe('Autocomplete', () => {
  it('renders nothing with zero items', async () => {
    const { lastFrame } = render(<Autocomplete items={[]} onAccept={() => {}} />);
    await tick();
    expect(lastFrame() ?? '').toBe('');
  });

  it('renders all items with the first highlighted by default', async () => {
    const { lastFrame } = render(<Autocomplete items={ITEMS} onAccept={() => {}} />);
    await tick();
    const frame = lastFrame() ?? '';
    expect(frame).toContain('/help');
    expect(frame).toContain('/logs');
    expect(frame).toContain('/status');
    expect(frame).toContain('List available commands');
    expect(frame).toMatch(/❯ \/help/);
  });

  it('moves the highlight on Down/Up without changing the accepted value until Tab', async () => {
    const onAccept = vi.fn();
    const { lastFrame, stdin } = render(<Autocomplete items={ITEMS} onAccept={onAccept} />);
    await tick();
    stdin.write(DOWN);
    await tick();
    expect(lastFrame() ?? '').toMatch(/❯ \/logs/);
    stdin.write(DOWN);
    await tick();
    expect(lastFrame() ?? '').toMatch(/❯ \/status/);
    stdin.write(UP);
    await tick();
    expect(lastFrame() ?? '').toMatch(/❯ \/logs/);
    expect(onAccept).not.toHaveBeenCalled();
  });

  it('accepts the highlighted item on Tab', async () => {
    const onAccept = vi.fn();
    const { stdin } = render(<Autocomplete items={ITEMS} onAccept={onAccept} />);
    await tick();
    stdin.write(DOWN);
    await tick();
    stdin.write(TAB);
    await tick();
    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onAccept).toHaveBeenCalledWith(ITEMS[1]);
  });

  it('does not respond to keys when isActive is false', async () => {
    const onAccept = vi.fn();
    const { lastFrame, stdin } = render(<Autocomplete items={ITEMS} onAccept={onAccept} isActive={false} />);
    await tick();
    expect(lastFrame() ?? '').toBe('');
    stdin.write(TAB);
    await tick();
    expect(onAccept).not.toHaveBeenCalled();
  });

  it('scrolls the window so Down past the visible cap brings the highlight (and an "N more" hint) into view', async () => {
    const many: AutocompleteItem[] = Array.from({ length: 12 }, (_, i) => ({ value: `cmd${i}`, label: `/cmd${i}` }));
    const { lastFrame, stdin } = render(<Autocomplete items={many} onAccept={() => {}} maxVisible={5} />);
    await tick();
    let frame = lastFrame() ?? '';
    expect(frame).toContain('/cmd0');
    expect(frame).toContain('/cmd4');
    expect(frame).not.toContain('/cmd5');
    expect(frame).toContain('↓ 7 more');
    // Move the highlight past the initial 5-row window (indices 0..4).
    for (let i = 0; i < 6; i++) {
      stdin.write(DOWN);
      await tick();
    }
    // Highlight is now at index 6 — must be ON SCREEN, not scrolled past.
    frame = lastFrame() ?? '';
    expect(frame).toMatch(/❯ \/cmd6/);
    expect(frame).toContain('↑ 2 more');
    expect(frame).not.toContain('/cmd0');
  });

  it('accepts an item that is only visible after scrolling past the initial window', async () => {
    const many: AutocompleteItem[] = Array.from({ length: 12 }, (_, i) => ({ value: `cmd${i}`, label: `/cmd${i}` }));
    const onAccept = vi.fn();
    const { stdin } = render(<Autocomplete items={many} onAccept={onAccept} maxVisible={5} />);
    await tick();
    for (let i = 0; i < 8; i++) {
      stdin.write(DOWN);
      await tick();
    }
    stdin.write(TAB);
    await tick();
    expect(onAccept).toHaveBeenCalledWith(many[8]);
  });

  it('reports the highlighted item via onHighlightChange as it moves, and null when there is nothing to highlight', async () => {
    const onHighlightChange = vi.fn();
    const { stdin, rerender } = render(<Autocomplete items={ITEMS} onAccept={() => {}} onHighlightChange={onHighlightChange} />);
    await tick();
    expect(onHighlightChange).toHaveBeenLastCalledWith(ITEMS[0]);
    stdin.write(DOWN);
    await tick();
    expect(onHighlightChange).toHaveBeenLastCalledWith(ITEMS[1]);
    // Enter, without ever pressing Tab, must be resolvable by a caller
    // reading back exactly this value — the whole point of the callback.
    rerender(<Autocomplete items={[]} onAccept={() => {}} onHighlightChange={onHighlightChange} />);
    await tick();
    expect(onHighlightChange).toHaveBeenLastCalledWith(null);
  });

  it('resets the highlight to index 0 when the item set changes content (e.g. the user keeps typing)', async () => {
    const { lastFrame, stdin, rerender } = render(<Autocomplete items={ITEMS} onAccept={() => {}} />);
    await tick();
    stdin.write(DOWN);
    await tick();
    stdin.write(DOWN);
    await tick();
    expect(lastFrame() ?? '').toMatch(/❯ \/status/);
    // Narrower filter (as if the user typed another character) — content
    // changed, so the highlight must land back on the new index 0, not
    // whatever numeric index survived from the old list.
    rerender(<Autocomplete items={[ITEMS[1]!]} onAccept={() => {}} />);
    await tick();
    const frame = lastFrame() ?? '';
    expect(frame).toContain('/logs');
    expect(frame).not.toContain('/status');
    expect(frame).toMatch(/❯ \/logs/);
  });
});
