/**
 * Terminal OrbPreview
 *
 * Same interface as @almadar/ui/runtime/OrbPreview.
 * Renders an orbital schema as a text sketch using terminal-ui components.
 */

import React from 'react';
import { Box, Text } from 'ink';
import { Typography } from '../atoms/Typography.js';
import { Divider } from '../atoms/Divider.js';
import { Stack } from '../atoms/Stack.js';
import { Card } from '../atoms/Card.js';
import { Badge } from '../atoms/Badge.js';
import { resolvePattern, type PatternConfig } from './pattern-resolver.js';

export interface OrbPreviewProps {
  /** The orbital schema. Accepts a JSON string or a parsed object. */
  schema: string | Record<string, unknown>;
  /** Mock entity data keyed by entity name. */
  mockData?: Record<string, unknown[]>;
}

interface OrbitalDef {
  name: string;
  entity?: { name: string; fields?: Array<{ name: string; type?: string }> };
  traits?: Array<{
    name: string;
    states?: Array<{ name: string }>;
    transitions?: Array<{
      event: string;
      from: string;
      to: string;
      effects?: unknown[];
    }>;
  }>;
  pages?: Array<{ name?: string; route?: string }>;
}

function parseSchema(schema: string | Record<string, unknown>): { name: string; orbitals: OrbitalDef[] } {
  const parsed = typeof schema === 'string' ? JSON.parse(schema) : schema;
  return {
    name: parsed.name ?? 'Unknown',
    orbitals: (parsed.orbitals ?? []) as OrbitalDef[],
  };
}

function extractRenderUi(transition: { effects?: unknown[] }): PatternConfig | null {
  if (!transition.effects) return null;
  for (const eff of transition.effects) {
    if (Array.isArray(eff) && eff[0] === 'render-ui' && eff[2]) {
      return eff[2] as PatternConfig;
    }
  }
  return null;
}

function OrbitalCard({ orbital }: { orbital: OrbitalDef }): React.ReactElement {
  const entity = orbital.entity;
  const traits = orbital.traits ?? [];
  const pages = orbital.pages ?? [];
  const allStates = traits.flatMap(t => (t.states ?? []).map(s => s.name));
  const allEvents = traits.flatMap(t => (t.transitions ?? []).map(tr => tr.event));
  const uniqueEvents = [...new Set(allEvents)];

  // Find the first render-ui effect (INIT transition)
  let renderUi: PatternConfig | null = null;
  for (const trait of traits) {
    for (const transition of trait.transitions ?? []) {
      const ui = extractRenderUi(transition);
      if (ui) {
        renderUi = ui;
        break;
      }
    }
    if (renderUi) break;
  }

  return (
    <Card title={orbital.name}>
      {/* Render-UI sketch */}
      {renderUi ? (
        <Box flexDirection="column" paddingBottom={1}>
          {resolvePattern(renderUi)}
        </Box>
      ) : null}

      {/* Entity summary */}
      {entity ? (
        <Box>
          <Text dimColor>Entity: </Text>
          <Text bold>{entity.name}</Text>
          {entity.fields && entity.fields.length > 0 ? (
            <Text dimColor> ({entity.fields.map(f => f.name).join(', ')})</Text>
          ) : null}
        </Box>
      ) : null}

      {/* Traits summary */}
      {traits.length > 0 ? (
        <Box>
          <Text dimColor>Traits: </Text>
          {traits.map((t, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <Text dimColor>, </Text> : null}
              <Text>{t.name}</Text>
              <Text dimColor>({(t.states ?? []).length} states)</Text>
            </React.Fragment>
          ))}
        </Box>
      ) : null}

      {/* Events */}
      {uniqueEvents.length > 0 ? (
        <Box>
          <Text dimColor>Events: </Text>
          <Text>{uniqueEvents.join(' → ')}</Text>
        </Box>
      ) : null}

      {/* Pages */}
      {pages.length > 0 ? (
        <Box>
          <Text dimColor>Pages: </Text>
          {pages.map((p, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <Text dimColor>, </Text> : null}
              <Badge variant="info">{p.route ?? p.name ?? `page-${i}`}</Badge>
            </React.Fragment>
          ))}
        </Box>
      ) : null}
    </Card>
  );
}

/**
 * Renders a terminal sketch of an Orbital schema.
 *
 * Same interface as @almadar/ui/runtime/OrbPreview:
 * - Accepts schema as JSON string or object
 * - Accepts optional mockData
 *
 * Renders each orbital as a Card with:
 * - Render-UI sketch (from INIT transition's render-ui effect)
 * - Entity name + fields
 * - Trait names + state counts
 * - Event flow
 * - Page routes
 */
export function OrbPreview({ schema }: OrbPreviewProps): React.ReactElement {
  let parsed: { name: string; orbitals: OrbitalDef[] };

  try {
    parsed = parseSchema(schema);
  } catch {
    return <Typography variant="body" color="error">Failed to parse schema</Typography>;
  }

  if (parsed.orbitals.length === 0) {
    return (
      <Stack direction="vertical" gap="sm">
        <Typography variant="h3">{parsed.name}</Typography>
        <Typography variant="caption">No orbitals defined</Typography>
      </Stack>
    );
  }

  return (
    <Stack direction="vertical" gap="md">
      <Typography variant="h2">{parsed.name}</Typography>
      <Typography variant="caption">{parsed.orbitals.length} orbital(s)</Typography>
      <Divider />
      {parsed.orbitals.map((orbital, i) => (
        <OrbitalCard key={i} orbital={orbital} />
      ))}
    </Stack>
  );
}
