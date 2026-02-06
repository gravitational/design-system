import type { Meta } from '@storybook/react-vite';

import { Box, Text } from '../../../..';

const meta = {
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;

export function Preview() {
  return (
    <Box>
      <Text />
    </Box>
  );
}

Preview.tags = ['!dev'];

export function Example() {
  return (
    <Box>
      <Text />
    </Box>
  );
}

Example.tags = ['!dev'];
