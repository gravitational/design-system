import { AbsoluteCenter, Box, HStack, Spinner } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

import { HorseIcon } from '../../../../icons';

const meta = {
  component: AbsoluteCenter,
} satisfies Meta<typeof AbsoluteCenter>;

export default meta;

export function Example() {
  return (
    <Box h="3xs" pos="relative" borderRadius="md">
      <AbsoluteCenter
        bg="brand"
        color="text.primaryInverse"
        borderRadius="md"
        py={1}
        px={2}
      >
        Centered Box
      </AbsoluteCenter>
    </Box>
  );
}

Example.tags = ['!dev'];

export function WithContent() {
  return (
    <Box h="3xs" pos="relative" borderRadius="md">
      <AbsoluteCenter>
        <Box bg="brand" borderRadius="full" p={4}>
          <HorseIcon fontSize="48px" color="text.primaryInverse" />
        </Box>
      </AbsoluteCenter>
    </Box>
  );
}

WithContent.tags = ['!dev'];

export function Overlay() {
  return (
    <Box h="3xs" pos="relative" borderRadius="md">
      <AbsoluteCenter>
        <HStack
          bg="blackAlpha.600"
          borderRadius="md"
          color="text.muted"
          p={2}
          gap={4}
        >
          <Spinner size="sm" />
          Loading...
        </HStack>
      </AbsoluteCenter>
    </Box>
  );
}

Overlay.tags = ['!dev'];
