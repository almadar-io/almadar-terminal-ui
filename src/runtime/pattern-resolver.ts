/**
 * Terminal Pattern Resolver
 *
 * Maps pattern types from @almadar/patterns to terminal-ui components.
 * Same algorithm as @almadar/ui/renderer/pattern-resolver.ts, different component targets.
 */

import React from 'react';
import { Typography } from '../atoms/Typography.js';
import { Badge } from '../atoms/Badge.js';
import { Button } from '../atoms/Button.js';
import { ProgressBar } from '../atoms/ProgressBar.js';
import { Divider } from '../atoms/Divider.js';
import { Icon } from '../atoms/Icon.js';
import { Input } from '../atoms/Input.js';
import { Box } from '../atoms/Box.js';
import { Stack } from '../atoms/Stack.js';
import { Card } from '../atoms/Card.js';
import { Checkbox } from '../atoms/Checkbox.js';
import { DataGrid } from '../molecules/DataGrid.js';
import { DataList } from '../molecules/DataList.js';
import { Tabs } from '../molecules/Tabs.js';
import { Alert } from '../molecules/Alert.js';
import { EmptyState } from '../molecules/EmptyState.js';
import { ErrorState } from '../molecules/ErrorState.js';
import { LoadingState } from '../molecules/LoadingState.js';
import { FormField } from '../molecules/FormField.js';
import { Breadcrumb } from '../molecules/Breadcrumb.js';
import { WizardProgress } from '../molecules/WizardProgress.js';

export interface PatternConfig {
  type: string;
  children?: PatternConfig[];
  [key: string]: unknown;
}

// Props come from schema JSON — dynamic resolution, components validate their own props
type ComponentFactory = (props: Record<string, unknown>, children?: React.ReactNode) => React.ReactElement;

/**
 * Create element with dynamic props. This is a pattern resolver that maps
 * schema JSON to components at runtime — props are inherently untyped.
 */
function el(component: React.ElementType, props: Record<string, unknown>, children?: React.ReactNode): React.ReactElement {
  return React.createElement(component, props, children);
}
const COMPONENT_MAP: Record<string, ComponentFactory> = {
  'stack': (p, c) => el(Stack, { direction: p.direction, gap: p.gap }, c),
  'box': (p, c) => el(Box, { border: !!p.border, padding: p.padding as number }, c),
  'typography': (p) => el(Typography, { variant: p.variant as string, content: String(p.content ?? p.children ?? '') }),
  'heading': (p) => el(Typography, { variant: 'h2', content: String(p.content ?? p.children ?? '') }),
  'text': (p) => el(Typography, { variant: 'body', content: String(p.content ?? p.children ?? '') }),
  'button': (p) => el(Button, { variant: p.variant as string, label: String(p.label ?? p.children ?? p.event ?? 'Button') }),
  'badge': (p) => el(Badge, { variant: p.variant as string }, String(p.content ?? p.children ?? '')),
  'icon': (p) => el(Icon, { name: p.name as string ?? p.icon as string, color: p.color as string }),
  'input': (p) => el(Input, { placeholder: String(p.placeholder ?? p.name ?? 'input') }),
  'textarea': (p) => el(Input, { placeholder: String(p.placeholder ?? 'text area') }),
  'select': (p) => el(Typography, { variant: 'body', content: `[Select: ${p.placeholder ?? 'choose'}]` }),
  'checkbox': (p) => el(Checkbox, { label: String(p.label ?? ''), checked: !!p.checked }),
  'divider': () => el(Divider, {}),
  'spacer': () => el(Box, { padding: 1 }),
  'progress-bar': (p) => el(ProgressBar, { value: Number(p.value ?? 50), max: Number(p.max ?? 100), showPercentage: true }),
  'card': (p, c) => el(Card, { title: String(p.title ?? '') }, c),
  'data-grid': (p) => {
    const fields = (p.fields ?? p.columns ?? []) as Array<{ name: string; label?: string }>;
    const columns = fields.map(f => ({ name: f.name, label: f.label ?? f.name }));
    return el(DataGrid, { columns, rows: [{ ...Object.fromEntries(columns.map(c => [c.name, '...'])) }] });
  },
  'data-list': (p) => {
    const fields = (p.fields ?? []) as Array<{ name: string; label?: string }>;
    return el(DataList, { entity: [{}], fields: fields.length > 0 ? fields : [{ name: 'item' }] });
  },
  'tabs': (p) => {
    const items = ((p.items ?? p.tabs ?? []) as Array<{ id?: string; label?: string }>).map((t, i) => ({
      id: t.id ?? `tab-${i}`,
      label: t.label ?? `Tab ${i + 1}`,
      active: i === 0,
    }));
    return el(Tabs, { items });
  },
  'breadcrumb': (p) => {
    const items = ((p.items ?? []) as Array<{ label: string }>);
    return el(Breadcrumb, { items });
  },
  'wizard-progress': (p) => {
    const steps = (p.steps ?? []) as string[];
    return el(WizardProgress, { steps, activeStep: Number(p.activeStep ?? 0) });
  },
  'alert': (p) => el(Alert, { variant: p.variant as string ?? 'info', title: String(p.title ?? ''), message: String(p.message ?? p.content ?? '') }),
  'empty-state': (p) => el(EmptyState, { title: String(p.title ?? 'Empty'), description: String(p.description ?? '') }),
  'error-state': (p) => el(ErrorState, { title: String(p.title ?? 'Error'), message: String(p.message ?? '') }),
  'loading-state': (p) => el(LoadingState, { message: String(p.message ?? 'Loading...') }),
  'form': (p, c) => el(Box, { border: true }, c),
  'form-section': (p, c) => el(FormField, { label: String(p.label ?? p.title ?? 'Section'), children: c ?? el(Typography, { content: '...' }) }),
  'form-field': (p, c) => el(FormField, { label: String(p.label ?? p.name ?? 'Field'), required: !!p.required, children: c ?? el(Input, { placeholder: String(p.placeholder ?? '') }) }),
  'modal': (p, c) => el(Box, { border: true, padding: 1 }, c),
  'drawer': (p, c) => el(Box, { border: true, padding: 1 }, c),
  'search-input': (p) => el(Input, { placeholder: String(p.placeholder ?? 'Search...') }),
  'simple-grid': (p, c) => el(Stack, { direction: 'horizontal', gap: 'md' }, c),
  'center': (p, c) => el(Box, {}, c),
  'dashboard-layout': (p, c) => el(Box, { border: true, padding: 1 }, c),
};

/**
 * Resolve a pattern config to a terminal-ui React element.
 */
export function resolvePattern(config: PatternConfig): React.ReactElement {
  const { type, children: childConfigs, ...props } = config;

  const factory = COMPONENT_MAP[type];

  // Resolve children recursively
  let childElements: React.ReactNode = null;
  if (childConfigs && Array.isArray(childConfigs) && childConfigs.length > 0) {
    childElements = childConfigs.map((child, i) =>
      React.createElement(React.Fragment, { key: i }, resolvePattern(child))
    );
  }

  if (!factory) {
    // Unknown pattern: render as labeled box
    return el(Typography, { variant: 'caption', content: `[${type}]` });
  }

  return factory(props as Record<string, unknown>, childElements);
}
