import { VStack } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';
import { useState } from 'react';

import {
  ComposedToggle,
  Toggle,
  type ComposedToggleProps,
} from '../../../../components';

const meta = {
  component: ComposedToggle,
} satisfies Meta<typeof ComposedToggle>;

export default meta;

function ControlledToggle({
  isToggled: initialToggled,
  ...rest
}: Omit<ComposedToggleProps, 'onToggle'>) {
  const [on, setOn] = useState(initialToggled);
  return (
    <ComposedToggle
      {...rest}
      isToggled={on}
      onToggle={() => {
        setOn(value => !value);
      }}
    />
  );
}

export function Sizes() {
  return (
    <VStack gap={2} align="start">
      <ControlledToggle size="sm" isToggled={false} label="Small" />
      <ControlledToggle size="lg" isToggled={false} label="Large" />
    </VStack>
  );
}
Sizes.tags = ['!dev'];

export function Toggled() {
  return (
    <VStack gap={2} align="start">
      <ControlledToggle isToggled={false} label="Off by default" />
      <ControlledToggle isToggled={true} label="On by default" />
    </VStack>
  );
}
Toggled.tags = ['!dev'];

export function Disabled() {
  return (
    <VStack gap={2} align="start">
      <ControlledToggle disabled isToggled={false} label="Disabled off" />
      <ControlledToggle disabled isToggled={true} label="Disabled on" />
    </VStack>
  );
}
Disabled.tags = ['!dev'];

export function ComposeExample() {
  return (
    <Toggle.Root>
      <Toggle.HiddenInput />
      <Toggle.Control>
        <Toggle.Thumb />
      </Toggle.Control>
      <Toggle.Label>Toggle</Toggle.Label>
    </Toggle.Root>
  );
}
ComposeExample.tags = ['!dev'];
