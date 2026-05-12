import { HStack } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

import { IconButton, VStack } from '../../../../components';
import { HorseIcon } from '../../../../icons';

const hiddenTags = ['!dev'];

const meta = {
  title: 'Components/Buttons/Icon Button',
  component: IconButton,
} satisfies Meta<typeof IconButton>;

export default meta;

export function DefaultExample() {
  return (
    <IconButton aria-label="Horse">
      <HorseIcon />
    </IconButton>
  );
}
DefaultExample.tags = hiddenTags;

export function SizesExample() {
  return (
    <VStack align="start">
      <HStack>
        <IconButton aria-label="Small" size="sm">
          <HorseIcon />
        </IconButton>
        <IconButton aria-label="Medium" size="md">
          <HorseIcon />
        </IconButton>
        <IconButton aria-label="Large" size="lg">
          <HorseIcon />
        </IconButton>
      </HStack>
      <HStack>
        <IconButton aria-label="Small-Square" size="sm" shape="square">
          <HorseIcon />
        </IconButton>
        <IconButton aria-label="Medium-Square" size="md" shape="square">
          <HorseIcon />
        </IconButton>
        <IconButton aria-label="Large-Square" size="lg" shape="square">
          <HorseIcon />
        </IconButton>
      </HStack>
    </VStack>
  );
}
SizesExample.tags = hiddenTags;

export function DisabledExample() {
  return (
    <IconButton aria-label="Disabled" disabled>
      <HorseIcon />
    </IconButton>
  );
}
DisabledExample.tags = hiddenTags;
