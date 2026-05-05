import { VStack } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

import { Input } from '../../../../components';
import { AtIcon, HorseIcon } from '../../../../icons';

const meta = {
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;

export function Sizes() {
  return (
    <VStack gap={3} align="stretch" minW="320px">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </VStack>
  );
}

Sizes.tags = ['!dev'];

export function WithIcon() {
  return (
    <VStack gap={3} align="stretch" minW="320px">
      <Input size="sm" icon={AtIcon} placeholder="Small with icon" />
      <Input size="md" icon={AtIcon} placeholder="Medium with icon" />
      <Input size="lg" icon={HorseIcon} placeholder="Large with icon" />
    </VStack>
  );
}

WithIcon.tags = ['!dev'];

export function HasError() {
  return (
    <VStack gap={3} align="stretch" minW="320px">
      <Input hasError placeholder="Invalid value" />
      <Input hasError icon={AtIcon} placeholder="Invalid with icon" />
    </VStack>
  );
}

HasError.tags = ['!dev'];

export function Disabled() {
  return (
    <VStack gap={3} align="stretch" minW="320px">
      <Input disabled placeholder="Disabled" />
      <Input disabled icon={AtIcon} placeholder="Disabled with icon" />
    </VStack>
  );
}

Disabled.tags = ['!dev'];

export function ReadOnly() {
  return (
    <VStack gap={3} align="stretch" minW="320px">
      <Input readOnly defaultValue="Read-only value" />
    </VStack>
  );
}

ReadOnly.tags = ['!dev'];
