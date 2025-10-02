import { Box, Container, For, Stack } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

const meta = {
  component: Container,
} satisfies Meta<typeof Container>;

export default meta;

export function Preview() {
  return (
    <Box>
      <Container my={2}>
        <Box borderWidth="1px" borderColor="brand" borderRadius="md" px={2}>
          This box is in a container
        </Box>
      </Container>
    </Box>
  );
}

Preview.tags = ['!dev'];

export function Sizes() {
  return (
    <Stack>
      <For each={['sm', 'md', 'xl', '2xl']}>
        {size => (
          <Container key={size} maxW={size} px="2">
            <Box borderWidth="1px" borderColor="brand" borderRadius="md" px={2}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
              consectetur, tortor in lacinia eleifend, dui nisl tristique nunc.
            </Box>
          </Container>
        )}
      </For>
    </Stack>
  );
}

Sizes.tags = ['!dev'];

export function Fluid() {
  return (
    <Box>
      <Container fluid my={2}>
        <Box borderWidth="1px" borderColor="brand" borderRadius="md" px={2}>
          This box is in a container
        </Box>
      </Container>
    </Box>
  );
}

Fluid.tags = ['!dev'];
