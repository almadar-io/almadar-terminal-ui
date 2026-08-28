import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import { resolveColor } from '../theme.js';

export interface AutocompleteItem {
  /** Stable identity for the item — also what gets passed to `onAccept`. */
  value: string;
  /** Display text, e.g. `/help`. */
  label: string;
  description?: string;
}

export interface AutocompleteProps {
  /** Already-filtered/ranked candidates, best match first. */
  items: AutocompleteItem[];
  /** Fires on Tab for the currently highlighted item. */
  onAccept: (item: AutocompleteItem) => void;
  /**
   * Fires whenever the effectively-highlighted item changes, including to
   * `null` when there's nothing to highlight (empty list or inactive). A
   * caller wiring "Enter runs the highlighted item" needs to know which item
   * that is BEFORE Enter is pressed — Ink's `useInput` gives every active
   * hook the same keystroke with no ordering/preventDefault, so an input
   * component's own Enter handler can't be told "use this instead" in the
   * same tick. Tracking the highlight via this callback (committed on an
   * earlier render, read back synchronously on submit) sidesteps that race
   * entirely, rather than trying to coordinate two `useInput` hooks on one
   * keystroke.
   */
  onHighlightChange?: (item: AutocompleteItem | null) => void;
  /** Cap on rendered rows before an "N more" line. Default 8. */
  maxVisible?: number;
  /** Whether this panel currently captures Up/Down/Tab. Default true — set
   *  false when there's nothing to suggest so it doesn't compete with other
   *  `useInput` hooks (matches `LogViewer`'s `isActive` convention). */
  isActive?: boolean;
}

const PRIMARY = resolveColor('primary');

/**
 * A live-filtered suggestion list rendered under a text input: Up/Down move
 * the highlight, Tab accepts. Renders nothing when `items` is empty, so a
 * caller can mount it unconditionally and let `items`/`isActive` gate it.
 */
export function Autocomplete({ items, onAccept, onHighlightChange, maxVisible = 8, isActive = true }: AutocompleteProps): React.ReactElement | null {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset the highlight when the *content* of the suggestion set changes —
  // keyed on the values, not the array reference, so a parent re-render that
  // happens to recompute an equal-content array (e.g. on an unrelated live
  // update) doesn't spuriously reset the user's in-progress navigation.
  const key = items.map((item) => item.value).join('\n');
  useEffect(() => {
    setSelectedIndex(0);
  }, [key]);

  const clamped = items.length > 0 ? Math.min(selectedIndex, items.length - 1) : -1;
  const highlighted = isActive && clamped >= 0 ? (items[clamped] ?? null) : null;

  useEffect(() => {
    onHighlightChange?.(highlighted);
  }, [highlighted, onHighlightChange]);

  useInput(
    (_input, key_) => {
      if (items.length === 0) return;
      if (key_.upArrow) {
        setSelectedIndex((i) => Math.max(0, i - 1));
      } else if (key_.downArrow) {
        setSelectedIndex((i) => Math.min(items.length - 1, i + 1));
      } else if (key_.tab) {
        const item = items[Math.min(selectedIndex, items.length - 1)];
        if (item) onAccept(item);
      }
    },
    { isActive: isActive && items.length > 0 },
  );

  if (!isActive || items.length === 0) return null;
  // A window that FOLLOWS the highlight, not a static first-N slice — Down
  // past the bottom edge must scroll the list, or the highlight (and Tab's
  // target) moves somewhere the user can never see.
  const maxStart = Math.max(0, items.length - maxVisible);
  const windowStart = Math.min(Math.max(0, clamped - maxVisible + 1), maxStart);
  const visible = items.slice(windowStart, windowStart + maxVisible);
  const hiddenAbove = windowStart;
  const hiddenBelow = items.length - (windowStart + visible.length);

  return (
    <Box flexDirection="column" marginLeft={2}>
      {hiddenAbove > 0 ? <Text dimColor>  ↑ {hiddenAbove} more</Text> : null}
      {visible.map((item, i) => {
        const globalIndex = windowStart + i;
        return (
          <Box key={item.value}>
            <Text color={globalIndex === clamped ? PRIMARY : undefined} bold={globalIndex === clamped}>
              {globalIndex === clamped ? '❯ ' : '  '}
              {item.label}
            </Text>
            {item.description ? <Text dimColor>  {item.description}</Text> : null}
          </Box>
        );
      })}
      {hiddenBelow > 0 ? <Text dimColor>  ↓ {hiddenBelow} more</Text> : null}
    </Box>
  );
}
