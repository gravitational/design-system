import { VStack } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

import { Checkbox, ComposedCheckbox } from '../../../../components';

const meta = {
  title: 'Components/Forms/Checkbox',
  component: ComposedCheckbox,
} satisfies Meta<typeof ComposedCheckbox>;

export default meta;

export function Sizes() {
  return (
    <VStack gap={2} align="start">
      <ComposedCheckbox size="sm" label="Small checkbox" />
      <ComposedCheckbox size="md" label="Medium checkbox" />
    </VStack>
  );
}
Sizes.tags = ['!dev'];

export function Checked() {
  return (
    <VStack gap={2} align="start">
      <ComposedCheckbox defaultChecked label="Checked by default" />
      <ComposedCheckbox defaultChecked={false} label="Unchecked" />
    </VStack>
  );
}
Checked.tags = ['!dev'];

export function Disabled() {
  return (
    <VStack gap={2} align="start">
      <ComposedCheckbox disabled label="Disabled unchecked" />
      <ComposedCheckbox disabled defaultChecked label="Disabled checked" />
    </VStack>
  );
}
Disabled.tags = ['!dev'];

export function Focused() {
  return (
    <VStack gap={2} align="start">
      <Checkbox.Root>
        <Checkbox.HiddenInput />
        <Checkbox.Control data-focus-visible="">
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Focused unchecked</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root defaultChecked>
        <Checkbox.HiddenInput />
        <Checkbox.Control data-focus-visible="">
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Focused checked</Checkbox.Label>
      </Checkbox.Root>
    </VStack>
  );
}
Focused.tags = ['!dev'];

export function Group() {
  return (
    <Checkbox.Group>
      <ComposedCheckbox value="one" label="Checkbox 1" />
      <ComposedCheckbox value="two" label="Checkbox 2" />
      <ComposedCheckbox value="three" label="Checkbox 3" />
    </Checkbox.Group>
  );
}
Group.tags = ['!dev'];

export function ComposeExample() {
  return (
    <Checkbox.Root>
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>Checkbox</Checkbox.Label>
    </Checkbox.Root>
  );
}
ComposeExample.tags = ['!dev'];
