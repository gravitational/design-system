import type { Meta } from '@storybook/react-vite';

import {
  Box,
  HStack,
  Stack,
  StackSeparator,
  styled,
  VStack,
} from '../../../..';

const meta = {
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;

const Item = styled('div', {
  base: {
    bg: 'brand',
    color: 'text.primaryInverse',
    display: 'flex',
    alignItems: 'center',
    h: 8,
  },
});

export function Preview() {
  return (
    <Stack>
      <Item />
      <Item />
      <Item />
    </Stack>
  );
}

Preview.tags = ['!dev'];

export function Horizontal() {
  return (
    <Stack direction="row">
      <Item flex={1} />
      <Item flex={1} />
      <Item flex={1} />
    </Stack>
  );
}

Horizontal.tags = ['!dev'];

export function HStackExample() {
  return (
    <HStack>
      <Item flex={1} h={2} />
      <Item flex={1} h={4} />
      <Item flex={1} />
    </HStack>
  );
}

HStackExample.tags = ['!dev'];

export function VStackExample() {
  return (
    <VStack>
      <Item w={20} />
      <Item w={100} />
      <Item w={200} />
    </VStack>
  );
}

VStackExample.tags = ['!dev'];

export function Separator() {
  return (
    <Stack separator={<StackSeparator />}>
      <Box h="20" bg="brand" />
      <Box h="20" bg="brand" />
      <Box h="20" bg="brand" />
    </Stack>
  );
}

Separator.tags = ['!dev'];
