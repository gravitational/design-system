import { HStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { IconButton } from '../../../../components';
import { HorseIcon } from '../../../../icons';

const meta = {
  title: 'Components/Buttons/Icon Button',
  component: IconButton,
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const IconButtonStory: Story = {
  name: 'Icon Button',
  args: {},
};

export function Sizes() {
  return (
    <HStack>
      <IconButton size="sm">
        <HorseIcon />
      </IconButton>
      <IconButton size="md">
        <HorseIcon />
      </IconButton>
      <IconButton size="lg">
        <HorseIcon />
      </IconButton>
      <IconButton size="xl">
        <HorseIcon />
      </IconButton>
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
      <IconButton fill="minimal">
        <HorseIcon />
      </IconButton>
      <IconButton fill="filled">
        <HorseIcon />
      </IconButton>
      <IconButton fill="border">
        <HorseIcon />
      </IconButton>
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

export function Rounded() {
  return (
    <HStack>
      <IconButton rounded="full" fill="minimal">
        <HorseIcon />
      </IconButton>
      <IconButton rounded="full" fill="filled">
        <HorseIcon />
      </IconButton>
      <IconButton rounded="full" fill="border">
        <HorseIcon />
      </IconButton>
    </HStack>
  );
}

Rounded.parameters = {
  controls: {
    disable: true,
  },
  control: {
    disable: true,
  },
};
