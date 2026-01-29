import type { Meta } from '@storybook/react-vite';

import { Box, Input } from '../../../..';

const meta = {
  component: Input,
  title: 'Components/Forms/Input',
} satisfies Meta<typeof Input>;

export default meta;

export function Preview() {
  return (
    <Box>
      <Input />
    </Box>
  );
}

export function Example() {
  return (
    <Box>
      <Input />
    </Box>
  );
}
