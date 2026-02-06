import type { Meta } from '@storybook/react-vite';

import { Box, Checkbox } from '../../../..';

const meta = {
  title: 'Components/Forms/Checkbox',
} satisfies Meta<typeof Checkbox.Root>;

export default meta;

export function Preview() {
  return (
    <Box>
      <Checkbox.Root>
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label />
      </Checkbox.Root>
    </Box>
  );
}

export function Example() {
  return (
    <Box>
      <Checkbox.Root>
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Example checkbox</Checkbox.Label>
      </Checkbox.Root>
    </Box>
  );
}

export function ExplorerExample() {
  return (
    <Checkbox.Group>
      <Checkbox.Root>
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Example checkbox</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root>
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Example checkbox</Checkbox.Label>
      </Checkbox.Root>
      <Checkbox.Root>
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Example checkbox</Checkbox.Label>
      </Checkbox.Root>
    </Checkbox.Group>
  );
}

ExplorerExample.tags = ['!dev'];
