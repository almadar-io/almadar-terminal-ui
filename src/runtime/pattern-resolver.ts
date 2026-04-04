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

// Props come from schema JSON — any is intentional, components validate their own props
// eslint-disable-next-line
type ComponentFactory = (props: Record<string, any>, children?: React.ReactNode) => React.ReactElement;

/* eslint-disable @typescript-eslint/no-explicit-any */
const COMPONENT_MAP: Record<string, ComponentFactory> = {
  'stack': (p, c) => React.createElement(Stack as any, { direction: p.direction, gap: p.gap }, c),
  'box': (p, c) => React.createElement(Box as any, { border: !!p.border, padding: p.padding as number }, c),
  'typography': (p) => React.createElement(Typography as any, { variant: p.variant as string, content: String(p.content ?? p.children ?? '') }),
  'heading': (p) => React.createElement(Typography as any, { variant: 'h2', content: String(p.content ?? p.children ?? '') }),
  'text': (p) => React.createElement(Typography as any, { variant: 'body', content: String(p.content ?? p.children ?? '') }),
  'button': (p) => React.createElement(Button as any, { variant: p.variant as string, label: String(p.label ?? p.children ?? p.event ?? 'Button') }),
  'badge': (p) => React.createElement(Badge as any, { variant: p.variant as string }, String(p.content ?? p.children ?? '')),
  'icon': (p) => React.createElement(Icon as any, { name: p.name as string ?? p.icon as string, color: p.color as string }),
  'input': (p) => React.createElement(Input as any, { placeholder: String(p.placeholder ?? p.name ?? 'input') }),
  'textarea': (p) => React.createElement(Input as any, { placeholder: String(p.placeholder ?? 'text area') }),
  'select': (p) => React.createElement(Typography as any, { variant: 'body', content: `[Select: ${p.placeholder ?? 'choose'}]` }),
  'checkbox': (p) => React.createElement(Checkbox as any, { label: String(p.label ?? ''), checked: !!p.checked }),
  'divider': () => React.createElement(Divider as any, {}),
  'spacer': () => React.createElement(Box as any, { padding: 1 }),
  'progress-bar': (p) => React.createElement(ProgressBar as any, { value: Number(p.value ?? 50), max: Number(p.max ?? 100), showPercentage: true }),
  'card': (p, c) => React.createElement(Card as any, { title: String(p.title ?? '') }, c),
  'data-grid': (p) => {
    const fields = (p.fields ?? p.columns ?? []) as Array<{ name: string; label?: string }>;
    const columns = fields.map(f => ({ name: f.name, label: f.label ?? f.name }));
    return React.createElement(DataGrid as any, { columns, rows: [{ ...Object.fromEntries(columns.map(c => [c.name, '...'])) }] });
  },
  'data-list': (p) => {
    const fields = (p.fields ?? []) as Array<{ name: string; label?: string }>;
    return React.createElement(DataList as any, { entity: [{}], fields: fields.length > 0 ? fields : [{ name: 'item' }] });
  },
  'tabs': (p) => {
    const items = ((p.items ?? p.tabs ?? []) as Array<{ id?: string; label?: string }>).map((t, i) => ({
      id: t.id ?? `tab-${i}`,
      label: t.label ?? `Tab ${i + 1}`,
      active: i === 0,
    }));
    return React.createElement(Tabs as any, { items });
  },
  'breadcrumb': (p) => {
    const items = ((p.items ?? []) as Array<{ label: string }>);
    return React.createElement(Breadcrumb as any, { items });
  },
  'wizard-progress': (p) => {
    const steps = (p.steps ?? []) as string[];
    return React.createElement(WizardProgress as any, { steps, activeStep: Number(p.activeStep ?? 0) });
  },
  'alert': (p) => React.createElement(Alert as any, { variant: p.variant as string ?? 'info', title: String(p.title ?? ''), message: String(p.message ?? p.content ?? '') }),
  'empty-state': (p) => React.createElement(EmptyState as any, { title: String(p.title ?? 'Empty'), description: String(p.description ?? '') }),
  'error-state': (p) => React.createElement(ErrorState as any, { title: String(p.title ?? 'Error'), message: String(p.message ?? '') }),
  'loading-state': (p) => React.createElement(LoadingState as any, { message: String(p.message ?? 'Loading...') }),
  'form': (p, c) => React.createElement(Box as any, { border: true }, c),
  'form-section': (p, c) => React.createElement(FormField as any, { label: String(p.label ?? p.title ?? 'Section'), children: c ?? React.createElement(Typography as any, { content: '...' }) }),
  'form-field': (p, c) => React.createElement(FormField as any, { label: String(p.label ?? p.name ?? 'Field'), required: !!p.required, children: c ?? React.createElement(Input as any, { placeholder: String(p.placeholder ?? '') }) }),
  'modal': (p, c) => React.createElement(Box as any, { border: true, padding: 1 }, c),
  'drawer': (p, c) => React.createElement(Box as any, { border: true, padding: 1 }, c),
  'search-input': (p) => React.createElement(Input as any, { placeholder: String(p.placeholder ?? 'Search...') }),
  'simple-grid': (p, c) => React.createElement(Stack as any, { direction: 'horizontal', gap: 'md' }, c),
  'center': (p, c) => React.createElement(Box as any, {}, c),
  'dashboard-layout': (p, c) => React.createElement(Box as any, { border: true, padding: 1 }, c),
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
    return React.createElement(Typography as any, { variant: 'caption', content: `[${type}]` });
  }

  return factory(props as Record<string, unknown>, childElements);
}
