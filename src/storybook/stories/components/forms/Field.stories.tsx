import type { Meta } from '@storybook/react-vite';

import { Box, Field } from '../../../..';

const meta = {
  component: Field.Root,
  title: 'Components/Forms/Field',
} satisfies Meta<typeof Field.Root>;

export default meta;

export function Preview() {
  return (
    <Box>
      <Field.Root />
    </Box>
  );
}

export function Example() {
  return (
    <Box>
      <Field.Root />
    </Box>
  );
}
