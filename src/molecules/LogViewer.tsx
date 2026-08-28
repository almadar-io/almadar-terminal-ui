import React, { useState } from 'react';
import { Box as InkBox, Text, useInput } from 'ink';
import { LogLine, type LogEntry } from './LogLine.js';

export interface LogViewerProps {
  /** Full history, oldest first. Never truncated by this component. */
  entries: LogEntry[];
  /** Visible row count. Default 16. */
  height?: number;
  title?: string;
  /** Whether this panel currently captures scroll keys. Default true — set
   *  false when collapsed so it doesn't compete with other `useInput` hooks. */
  isActive?: boolean;
}

/**
 * Scrollable log viewport: Up/Down/`j`/`k`/PageUp/PageDown/Home/End move a
 * window over `entries`, auto-following the tail (newest entries) until the
 * user scrolls up — standard pager/`tail -f` behaviour. Unlike `LogView`
 * (a fixed-height slice of only the last N entries with no way to see older
 * ones), the full history stays reachable by scrolling.
 */
export function LogViewer({ entries, height = 16, title = 'logs', isActive = true }: LogViewerProps): React.ReactElement {
  // null = following the live tail. A number pins the window's start index.
  const [offset, setOffset] = useState<number | null>(null);
  const maxOffset = Math.max(0, entries.length - height);

  useInput(
    (input, key) => {
      if (key.upArrow || input === 'k') {
        setOffset((o) => Math.max(0, (o ?? maxOffset) - 1));
      } else if (key.downArrow || input === 'j') {
        setOffset((o) => {
          const next = (o ?? maxOffset) + 1;
          return next >= maxOffset ? null : next;
        });
      } else if (key.pageUp) {
        setOffset((o) => Math.max(0, (o ?? maxOffset) - height));
      } else if (key.pageDown) {
        setOffset((o) => {
          const next = (o ?? maxOffset) + height;
          return next >= maxOffset ? null : next;
        });
      } else if (key.home) {
        setOffset(0);
      } else if (key.end) {
        setOffset(null);
      }
    },
    { isActive },
  );

  const effectiveOffset = Math.min(offset ?? maxOffset, maxOffset);
  const visible = entries.slice(effectiveOffset, effectiveOffset + height);
  const following = offset === null;
  const hiddenBelow = entries.length - (effectiveOffset + visible.length);

  return (
    <InkBox flexDirection="column" borderStyle="round" borderColor="cyan" paddingLeft={1} paddingRight={1}>
      <InkBox justifyContent="space-between">
        <Text bold color="cyan">{title} ({entries.length})</Text>
        <Text dimColor>{following ? 'following ↓ (↑/k to scroll)' : `line ${effectiveOffset + 1} (End to follow)`}</Text>
      </InkBox>
      {visible.length === 0 ? <Text dimColor>(empty)</Text> : null}
      {visible.map((entry, i) => (
        <LogLine key={effectiveOffset + i} {...entry} />
      ))}
      {hiddenBelow > 0 ? <Text dimColor>↓ {hiddenBelow} more line{hiddenBelow === 1 ? '' : 's'}</Text> : null}
    </InkBox>
  );
}
