import React, { useEffect, useState } from 'react';
import { render, Static, Box, Text } from 'ink';
import { Typography } from './atoms/Typography.js';
import { Badge } from './atoms/Badge.js';
import { ProgressBar } from './atoms/ProgressBar.js';
import { Divider } from './atoms/Divider.js';
import { Stack } from './atoms/Stack.js';
import { Card } from './atoms/Card.js';
import { Icon } from './atoms/Icon.js';
import { StatusDot } from './atoms/StatusDot.js';
import { Checkbox } from './atoms/Checkbox.js';
import { Switch } from './atoms/Switch.js';
import { Alert } from './molecules/Alert.js';
import { DataGrid } from './molecules/DataGrid.js';
import { Tree } from './molecules/Tree.js';
import { Breadcrumb } from './molecules/Breadcrumb.js';
import { WizardProgress } from './molecules/WizardProgress.js';
import { EmptyState } from './molecules/EmptyState.js';
import { Tabs } from './molecules/Tabs.js';
import { Toast } from './molecules/Toast.js';
import { ErrorState } from './molecules/ErrorState.js';
import { LoadingState } from './molecules/LoadingState.js';

// Each section is a static item that prints once and never re-renders
const sections = [
  { id: 'header', node: (
    <Box flexDirection="column">
      <Typography variant="h1">@almadar/terminal-ui</Typography>
      <Typography variant="caption">Component demo</Typography>
    </Box>
  )},
  { id: 'div-0', node: <Divider /> },

  { id: 'atoms-title', node: <Typography variant="h2">Atoms</Typography> },

  { id: 'typography', node: (
    <Box flexDirection="column">
      <Typography variant="h3">Typography</Typography>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="body">Body text</Typography>
      <Typography variant="caption">Caption text</Typography>
    </Box>
  )},
  { id: 'div-1', node: <Divider /> },

  { id: 'badge', node: (
    <Box flexDirection="column">
      <Typography variant="h3">Badge</Typography>
      <Stack direction="horizontal" gap="sm">
        <Badge variant="success">success</Badge>
        <Badge variant="warning">warning</Badge>
        <Badge variant="error">error</Badge>
        <Badge variant="info">info</Badge>
        <Badge variant="neutral">neutral</Badge>
      </Stack>
    </Box>
  )},
  { id: 'div-2', node: <Divider /> },

  { id: 'progress', node: (
    <Box flexDirection="column">
      <Typography variant="h3">ProgressBar</Typography>
      <ProgressBar value={72} max={100} showPercentage />
      <ProgressBar value={30} max={100} variant="warning" />
      <ProgressBar value={95} max={100} variant="success" showPercentage />
    </Box>
  )},
  { id: 'div-3', node: <Divider /> },

  { id: 'status', node: (
    <Box flexDirection="column">
      <Typography variant="h3">StatusDot</Typography>
      <Stack direction="horizontal" gap="md">
        <StatusDot status="online" label="Online" />
        <StatusDot status="away" label="Away" />
        <StatusDot status="busy" label="Busy" />
        <StatusDot status="offline" label="Offline" />
      </Stack>
    </Box>
  )},
  { id: 'div-4', node: <Divider /> },

  { id: 'icon', node: (
    <Box flexDirection="column">
      <Typography variant="h3">Icon</Typography>
      <Stack direction="horizontal" gap="sm">
        <Icon name="check" color="green" />
        <Icon name="cross" color="red" />
        <Icon name="bolt" color="yellow" />
        <Icon name="diamond" color="cyan" />
        <Icon name="warning" color="yellow" />
        <Icon name="gear" />
        <Icon name="star" color="yellow" />
      </Stack>
    </Box>
  )},
  { id: 'div-5', node: <Divider /> },

  { id: 'controls', node: (
    <Box flexDirection="column">
      <Typography variant="h3">Checkbox + Switch</Typography>
      <Stack direction="horizontal" gap="md">
        <Checkbox checked label="Checked" />
        <Checkbox label="Unchecked" />
        <Switch checked label="On" />
        <Switch label="Off" />
      </Stack>
    </Box>
  )},
  { id: 'div-6', node: <Divider /> },

  { id: 'card', node: (
    <Box flexDirection="column">
      <Typography variant="h3">Card</Typography>
      <Card title="Patient Intake" subtitle="Dermatology Clinic">
        <Typography variant="body">3 orbitals, 7 traits, 22 states</Typography>
      </Card>
    </Box>
  )},
  { id: 'div-7', node: <Divider /> },

  { id: 'spinner-label', node: (
    <Box flexDirection="column">
      <Typography variant="h3">Spinner</Typography>
      <Text dimColor>(animated spinner shown below)</Text>
    </Box>
  )},
  { id: 'div-8', node: <Divider /> },

  { id: 'mol-title', node: <Typography variant="h2">Molecules</Typography> },

  { id: 'alert', node: (
    <Box flexDirection="column" gap={1}>
      <Typography variant="h3">Alert</Typography>
      <Alert variant="info" title="Info" message="Schema validated successfully." />
      <Alert variant="warning" title="Warning" message="2 warnings found." />
      <Alert variant="error" title="Error" message="Missing transition from idle." />
    </Box>
  )},
  { id: 'div-9', node: <Divider /> },

  { id: 'toast', node: (
    <Box flexDirection="column">
      <Typography variant="h3">Toast</Typography>
      <Toast variant="success" message="Deployed to clinic.almadar.app" />
      <Toast variant="error" title="Build failed" message="TypeScript compilation error" />
    </Box>
  )},
  { id: 'div-10', node: <Divider /> },

  { id: 'error-state', node: (
    <Box flexDirection="column">
      <Typography variant="h3">ErrorState</Typography>
      <ErrorState title="Compilation Failed" message="Cannot find module '@almadar/std'" />
    </Box>
  )},
  { id: 'div-11', node: <Divider /> },

  { id: 'datagrid', node: (
    <Box flexDirection="column">
      <Typography variant="h3">DataGrid</Typography>
      <DataGrid
        columns={[
          { name: 'tool', label: 'Tool' },
          { name: 'status', label: 'Status' },
          { name: 'duration', label: 'Duration' },
          { name: 'tokens', label: 'Tokens' },
        ]}
        rows={[
          { tool: 'select_behaviors', status: '✓', duration: '0.8s', tokens: '420' },
          { tool: 'call_behavior', status: '✓', duration: '0.3s', tokens: '180' },
          { tool: 'compose_orbitals', status: '✓', duration: '0.1s', tokens: '0' },
          { tool: 'validate', status: '⧗', duration: '...', tokens: '' },
        ]}
      />
    </Box>
  )},
  { id: 'div-12', node: <Divider /> },

  { id: 'tree', node: (
    <Box flexDirection="column">
      <Typography variant="h3">Tree</Typography>
      <Tree data={{
        name: 'PatientIntake',
        children: [
          { name: 'IntakeWizard', children: [
            { name: 'idle' }, { name: 'filling' }, { name: 'submitted' },
          ]},
          { name: 'QueueBrowse', children: [
            { name: 'browsing' },
          ]},
        ],
      }} />
    </Box>
  )},
  { id: 'div-13', node: <Divider /> },

  { id: 'breadcrumb', node: (
    <Box flexDirection="column">
      <Typography variant="h3">Breadcrumb</Typography>
      <Breadcrumb items={[
        { label: 'Clinic App' },
        { label: 'PatientIntake' },
        { label: 'IntakeWizard' },
        { label: 'filling', isCurrent: true },
      ]} />
    </Box>
  )},
  { id: 'div-14', node: <Divider /> },

  { id: 'wizard', node: (
    <Box flexDirection="column">
      <Typography variant="h3">WizardProgress</Typography>
      <WizardProgress
        steps={['Decompose', 'Behaviors', 'Entities', 'State Machines', 'Effects', 'Render-UI', 'Validate']}
        activeStep={3}
      />
    </Box>
  )},
  { id: 'div-15', node: <Divider /> },

  { id: 'tabs', node: (
    <Box flexDirection="column">
      <Typography variant="h3">Tabs</Typography>
      <Tabs items={[
        { id: 'trace', label: 'Trace', active: true },
        { id: 'schema', label: 'Schema' },
        { id: 'validation', label: 'Validation', badge: 2 },
      ]} />
    </Box>
  )},
  { id: 'div-16', node: <Divider /> },

  { id: 'empty', node: (
    <Box flexDirection="column">
      <Typography variant="h3">EmptyState</Typography>
      <EmptyState icon="📁" title="No projects" description="Create your first project with orb." />
    </Box>
  )},
];

// Simulates a live agent session: gates progress, tools run, JEPA updates
function LiveTraceDemo(): React.ReactElement {
  const [gateIndex, setGateIndex] = useState(0);
  const [tools, setTools] = useState<{ name: string; status: string; duration: string }[]>([]);
  const [jepa, setJepa] = useState(0);
  const [done, setDone] = useState(false);

  const gates = [
    'Decompose', 'Behaviors', 'Entities', 'State Machines', 'Effects', 'Render-UI', 'Validate',
  ];

  const toolSequence = [
    { name: 'select_behaviors', delay: 800 },
    { name: 'call_behavior', delay: 600 },
    { name: 'call_behavior', delay: 400 },
    { name: 'compose_orbitals', delay: 300 },
    { name: 'update_render_ui', delay: 1200 },
    { name: 'validate', delay: 500 },
    { name: 'compile', delay: 700 },
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      if (step < toolSequence.length) {
        const tool = toolSequence[step];
        // Add tool as running
        setTools(prev => [...prev, { name: tool.name, status: '⧗', duration: '...' }]);
        setJepa(prev => Math.min(98, prev + Math.round(Math.random() * 15 + 5)));

        // Mark done after delay
        setTimeout(() => {
          setTools(prev => prev.map((t, i) =>
            i === step ? { ...t, status: '✓', duration: `${tool.delay}ms` } : t
          ));
        }, tool.delay);

        // Advance gate every 2 tools
        if (step % 2 === 1) {
          setGateIndex(prev => Math.min(gates.length - 1, prev + 1));
        }

        step++;
      } else {
        clearInterval(interval);
        setTimeout(() => setDone(true), 1000);
      }
    }, 900);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (done) {
      setTimeout(() => process.exit(0), 500);
    }
  }, [done]);

  return (
    <Box flexDirection="column">
      {/* Static: all the component demos printed once */}
      <Static items={sections}>
        {(section) => (
          <Box key={section.id}>{section.node}</Box>
        )}
      </Static>

      <Divider label="Live Trace Demo" />

      {/* Dynamic: this section re-renders without flickering the static content above */}
      <Box flexDirection="column" paddingTop={1}>
        <Typography variant="h3">Gate Pipeline</Typography>
        <WizardProgress steps={gates} activeStep={gateIndex} />

        <Box height={1} />

        <Typography variant="h3">Tool Timeline</Typography>
        {tools.length === 0 ? (
          <LoadingState message="Starting agent..." />
        ) : (
          <DataGrid
            columns={[
              { name: 'name', label: 'Tool' },
              { name: 'status', label: 'Status' },
              { name: 'duration', label: 'Duration' },
            ]}
            rows={tools}
          />
        )}

        <Box height={1} />

        <Stack direction="horizontal" gap="md">
          <Typography variant="body">JEPA:</Typography>
          <ProgressBar value={jepa} max={100} variant={jepa > 80 ? 'success' : jepa > 50 ? 'warning' : 'danger'} showPercentage width={25} />
        </Stack>

        <Box height={1} />

        {done ? (
          <Alert variant="success" title="Done" message={`${tools.length} tools executed. JEPA: ${jepa}%`} />
        ) : (
          <LoadingState message="Agent is working..." />
        )}
      </Box>
    </Box>
  );
}

render(<LiveTraceDemo />);
