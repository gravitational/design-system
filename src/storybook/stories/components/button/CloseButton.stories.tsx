import { HStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { CloseButton } from '../../../../components';

const meta = {
  title: 'Components/Buttons/Close Button',
  component: CloseButton,
  args: {
    disabled: false,
  },
} satisfies Meta<typeof CloseButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const CloseButtonStory: Story = {
  name: 'Close Button',
  args: {},
};

export function Sizes() {
  return (
    <HStack>
      <CloseButton size="sm" />
      <CloseButton size="md" />
      <CloseButton size="lg" />
      <CloseButton size="xl" />
    </HStack>
  );
}

Sizes.parameters = {
  controls: {
    disable: true,
  },
  control: {
    disable: true,
  },
};

export function Fills() {
  return (
    <HStack>
      <CloseButton fill="minimal" />
      <CloseButton fill="filled" />
      <CloseButton fill="border" />
    </HStack>
  );
}

Fills.parameters = {
  controls: {
    disable: true,
  },
  control: {
    disable: true,
  },
};
