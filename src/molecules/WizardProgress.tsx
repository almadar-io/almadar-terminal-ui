import React from 'react';
import { Box, Text } from 'ink';

export interface WizardProgressProps {
  steps: string[];
  activeStep?: number;
}

export function WizardProgress({ steps, activeStep = 0 }: WizardProgressProps): React.ReactElement {
  return (
    <Box>
      {steps.map((step, i) => {
        const isDone = i < activeStep;
        const isActive = i === activeStep;
        const isPending = i > activeStep;

        return (
          <React.Fragment key={i}>
            {i > 0 ? <Text dimColor> ─── </Text> : null}
            <Text
              bold={isActive}
              color={isDone ? 'green' : isActive ? 'cyan' : undefined}
              dimColor={isPending}
            >
              {isDone ? '✓' : isActive ? '◉' : '○'} {step}
            </Text>
          </React.Fragment>
        );
      })}
    </Box>
  );
}
