import { VStack } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

import { ComposedRadioGroup, RadioGroup } from '../../../../components';

const meta = {
  component: ComposedRadioGroup,
} satisfies Meta<typeof ComposedRadioGroup>;

export default meta;

export function Sizes() {
  return (
    <VStack gap={4} align="start">
      <ComposedRadioGroup
        size="sm"
        label="Small"
        defaultValue="one"
        options={[
          { value: 'one', label: 'Option 1' },
          { value: 'two', label: 'Option 2' },
        ]}
      />
      <ComposedRadioGroup
        size="md"
        label="Medium"
        defaultValue="one"
        options={[
          { value: 'one', label: 'Option 1' },
          { value: 'two', label: 'Option 2' },
        ]}
      />
    </VStack>
  );
}
Sizes.tags = ['!dev'];

export function Selected() {
  return (
    <ComposedRadioGroup
      defaultValue="two"
      options={[
        { value: 'one', label: 'Option 1' },
        { value: 'two', label: 'Option 2 (selected)' },
        { value: 'three', label: 'Option 3' },
      ]}
    />
  );
}
Selected.tags = ['!dev'];

export function Focused() {
  return (
    <RadioGroup.Root defaultValue="focused">
      <RadioGroup.Item value="unchecked">
        <RadioGroup.ItemHiddenInput />
        <RadioGroup.ItemIndicator data-focus-visible="" />
        <RadioGroup.ItemText>Focused unchecked</RadioGroup.ItemText>
      </RadioGroup.Item>
      <RadioGroup.Item value="focused">
        <RadioGroup.ItemHiddenInput />
        <RadioGroup.ItemIndicator data-focus-visible="" />
        <RadioGroup.ItemText>Focused checked</RadioGroup.ItemText>
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
}
Focused.tags = ['!dev'];

export function Disabled() {
  return (
    <ComposedRadioGroup
      defaultValue="one"
      options={[
        { value: 'one', label: 'Enabled option' },
        { value: 'two', label: 'Disabled option', disabled: true },
      ]}
    />
  );
}
Disabled.tags = ['!dev'];

export function ComposeExample() {
  return (
    <RadioGroup.Root defaultValue="one">
      <RadioGroup.Label>Radio group</RadioGroup.Label>
      <RadioGroup.Item value="one">
        <RadioGroup.ItemHiddenInput />
        <RadioGroup.ItemIndicator />
        <RadioGroup.ItemText>Option 1</RadioGroup.ItemText>
      </RadioGroup.Item>
      <RadioGroup.Item value="two">
        <RadioGroup.ItemHiddenInput />
        <RadioGroup.ItemIndicator />
        <RadioGroup.ItemText>Option 2</RadioGroup.ItemText>
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
}
ComposeExample.tags = ['!dev'];
