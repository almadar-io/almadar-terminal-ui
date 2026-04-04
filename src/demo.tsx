import React from 'react';
import { render } from 'ink';
import { Typography } from './atoms/Typography.js';
import { Badge } from './atoms/Badge.js';
import { ProgressBar } from './atoms/ProgressBar.js';
import { Divider } from './atoms/Divider.js';
import { Stack } from './atoms/Stack.js';
import { Card } from './atoms/Card.js';
import { Icon } from './atoms/Icon.js';
import { StatusDot } from './atoms/StatusDot.js';
import { Spinner } from './atoms/Spinner.js';
import { Checkbox } from './atoms/Checkbox.js';
import { Switch } from './atoms/Switch.js';
import { Alert } from './molecules/Alert.js';
import { DataGrid } from './molecules/DataGrid.js';
import { Tree } from './molecules/Tree.js';
import { LoadingState } from './molecules/LoadingState.js';
import { Breadcrumb } from './molecules/Breadcrumb.js';
import { WizardProgress } from './molecules/WizardProgress.js';
import { EmptyState } from './molecules/EmptyState.js';
import { Tabs } from './molecules/Tabs.js';
import { Toast } from './molecules/Toast.js';
import { ErrorState } from './molecules/ErrorState.js';

function Demo(): React.ReactElement {
  return (
    <Stack direction="vertical" gap="md">
      <Typography variant="h1">@almadar/terminal-ui</Typography>
      <Typography variant="caption">Component demo</Typography>
      <Divider />

      <Typography variant="h2">Atoms</Typography>

      <Typography variant="h3">Typography</Typography>
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="body">Body text</Typography>
      <Typography variant="caption">Caption text</Typography>
      <Divider />

      <Typography variant="h3">Badge</Typography>
      <Stack direction="horizontal" gap="sm">
        <Badge variant="success">success</Badge>
        <Badge variant="warning">warning</Badge>
        <Badge variant="error">error</Badge>
        <Badge variant="info">info</Badge>
        <Badge variant="neutral">neutral</Badge>
      </Stack>
      <Divider />

      <Typography variant="h3">ProgressBar</Typography>
      <ProgressBar value={72} max={100} showPercentage />
      <ProgressBar value={30} max={100} variant="warning" />
      <ProgressBar value={95} max={100} variant="success" showPercentage />
      <Divider />

      <Typography variant="h3">StatusDot</Typography>
      <Stack direction="horizontal" gap="md">
        <StatusDot status="online" label="Online" />
        <StatusDot status="away" label="Away" />
        <StatusDot status="busy" label="Busy" />
        <StatusDot status="offline" label="Offline" />
      </Stack>
      <Divider />

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
      <Divider />

      <Typography variant="h3">Checkbox + Switch</Typography>
      <Stack direction="horizontal" gap="md">
        <Checkbox checked label="Checked" />
        <Checkbox label="Unchecked" />
        <Switch checked label="On" />
        <Switch label="Off" />
      </Stack>
      <Divider />

      <Typography variant="h3">Card</Typography>
      <Card title="Patient Intake" subtitle="Dermatology Clinic">
        <Typography variant="body">3 orbitals, 7 traits, 22 states</Typography>
      </Card>
      <Divider />

      <Typography variant="h3">Spinner</Typography>
      <Stack direction="horizontal" gap="sm">
        <Spinner />
        <Typography variant="body">Loading...</Typography>
      </Stack>
      <Divider />

      <Typography variant="h2">Molecules</Typography>

      <Typography variant="h3">Alert</Typography>
      <Alert variant="info" title="Info" message="Schema validated successfully." />
      <Alert variant="warning" title="Warning" message="2 warnings found." />
      <Alert variant="error" title="Error" message="Missing transition from idle." />
      <Divider />

      <Typography variant="h3">Toast</Typography>
      <Toast variant="success" message="Deployed to clinic.almadar.app" />
      <Toast variant="error" title="Build failed" message="TypeScript compilation error" />
      <Divider />

      <Typography variant="h3">ErrorState</Typography>
      <ErrorState title="Compilation Failed" message="Cannot find module '@almadar/std'" />
      <Divider />

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
      <Divider />

      <Typography variant="h3">Tree</Typography>
      <Tree data={{
        name: 'PatientIntake',
        children: [
          { name: 'IntakeWizard', children: [
            { name: 'idle' },
            { name: 'filling' },
            { name: 'submitted' },
          ]},
          { name: 'QueueBrowse', children: [
            { name: 'browsing' },
          ]},
        ],
      }} />
      <Divider />

      <Typography variant="h3">Breadcrumb</Typography>
      <Breadcrumb items={[
        { label: 'Clinic App' },
        { label: 'PatientIntake' },
        { label: 'IntakeWizard' },
        { label: 'filling', isCurrent: true },
      ]} />
      <Divider />

      <Typography variant="h3">WizardProgress</Typography>
      <WizardProgress
        steps={['Decompose', 'Behaviors', 'Entities', 'State Machines', 'Effects', 'Render-UI', 'Validate']}
        activeStep={3}
      />
      <Divider />

      <Typography variant="h3">Tabs</Typography>
      <Tabs items={[
        { id: 'trace', label: 'Trace', active: true },
        { id: 'schema', label: 'Schema' },
        { id: 'validation', label: 'Validation', badge: 2 },
      ]} />
      <Divider />

      <Typography variant="h3">LoadingState</Typography>
      <LoadingState message="Agent is thinking..." />
      <Divider />

      <Typography variant="h3">EmptyState</Typography>
      <EmptyState icon="📁" title="No projects" description="Create your first project with orb." />
    </Stack>
  );
}

render(<Demo />);
