import { Box, Flex } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

const meta = {
  component: Flex,
} satisfies Meta<typeof Flex>;

export default meta;

export function Preview() {
  return (
    <Box>
      <Flex />
    </Box>
  );
}

Preview.tags = ['!dev'];

export function Example() {
  return (
    <Box>
      <Flex />
    </Box>
  );
}

Example.tags = ['!dev'];
