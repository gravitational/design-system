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
      <Heading size="xs">Heading (xs)</Heading>
      <Heading size="sm">Heading (sm)</Heading>
      <Heading size="md">Heading (md)</Heading>
      <Heading size="lg">Heading (lg)</Heading>
      <Heading size="xl">Heading (xl)</Heading>
      <Heading size="2xl">Heading (2xl)</Heading>
      <Heading size="3xl">Heading (3xl)</Heading>
    </Stack>
  );
}

Sizes.tags = ['!dev'];
