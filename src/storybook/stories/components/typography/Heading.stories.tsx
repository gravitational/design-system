import type { Meta } from '@storybook/react-vite';

import { Heading, Stack } from '../../../..';

const meta = {
  component: Heading,
} satisfies Meta<typeof Heading>;

export default meta;

export function Preview() {
  return <Heading size="lg">This is a Heading component</Heading>;
}

Preview.tags = ['!dev'];

export function Sizes() {
  return (
    <Stack>
      <Heading size="lg">Heading 1 (lg)</Heading>
      <Heading size="md">Heading 2 (md)</Heading>
      <Heading size="sm">Heading 3 (sm)</Heading>
      <Heading size="xs">Heading 4 (xs)</Heading>
    </Stack>
  );
}

Sizes.tags = ['!dev'];
