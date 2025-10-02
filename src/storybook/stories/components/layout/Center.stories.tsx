import { Box, Center, Circle, HStack, Square } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

import { CaretRightIcon, HorseIcon } from '../../../../icons';

const meta = {
  component: Center,
  argTypes: {
    inline: {
      control: 'boolean',
      description: 'If true, the box will be displayed as inline-block',
      type: {
        name: 'boolean',
      },
    },
  },
} satisfies Meta<typeof Center>;

export default meta;

export function Example() {
  return (
    <Center
      bg="interactive.tonal.neutral.1"
      h="3xs"
      borderRadius="md"
      py={1}
      px={2}
      m={4}
    >
      This will be centered
    </Center>
  );
}

Example.tags = ['!dev'];

export function Icon() {
  return (
    <HStack>
      <Center w="40px" h="40px" bg="brand" color="text.primaryInverse">
        <HorseIcon size="md" />
      </Center>

      <Center w="40px" h="40px" bg="brand" color="text.primaryInverse">
        <Box as="span" fontWeight="bold" fontSize="lg">
          1
        </Box>
      </Center>
    </HStack>
  );
}

Icon.tags = ['!dev'];

export function CenterWithInline() {
  return (
    <Center inline gap={2}>
      Go to page
      <CaretRightIcon />
    </Center>
  );
}

CenterWithInline.tags = ['!dev'];

export function SquareExample() {
  return (
    <Square bg="brand" size={10} color="text.primaryInverse">
      <HorseIcon size="md" />
    </Square>
  );
}

SquareExample.tags = ['!dev'];

export function CircleExample() {
  return (
    <Circle bg="brand" size={10} color="text.primaryInverse">
      <HorseIcon size="md" />
    </Circle>
  );
}

CircleExample.tags = ['!dev'];
