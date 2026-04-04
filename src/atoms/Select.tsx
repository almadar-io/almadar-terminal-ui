import React from 'react';
import SelectInput from 'ink-select-input';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export function Select({ options, onChange }: SelectProps): React.ReactElement {
  const items = options.map(opt => ({ label: opt.label, value: opt.value }));

  return (
    <SelectInput
      items={items}
      onSelect={(item) => onChange?.(item.value)}
    />
  );
}
