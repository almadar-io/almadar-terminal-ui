import React from 'react';
import { Box as InkBox } from 'ink';

export interface BoxProps {
  padding?: number;
  paddingX?: number;
  paddingY?: number;
  border?: boolean;
  borderStyle?: 'single' | 'double' | 'round' | 'bold' | 'classic';
  borderColor?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function Box({ padding, paddingX, paddingY, border, borderStyle = 'round', borderColor, fullWidth, children }: BoxProps): React.ReactElement {
  return (
    <InkBox
      borderStyle={border ? borderStyle : undefined}
      borderColor={borderColor}
      paddingLeft={paddingX ?? padding}
      paddingRight={paddingX ?? padding}
      paddingTop={paddingY ?? padding}
      paddingBottom={paddingY ?? padding}
      width={fullWidth ? '100%' : undefined}
      flexDirection="column"
    >
      {children}
    </InkBox>
  );
}
