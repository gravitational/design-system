import { HStack } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

import { Label } from '../../../../components';

const meta = {
  title: 'Components/Data Display/Label',
  component: Label,
} satisfies Meta<typeof Label>;

export default meta;

export function Variants() {
  return (
    <HStack gap={2}>
      <Label kind="primary">primary</Label>
      <Label kind="secondary">secondary</Label>
      <Label kind="success">success</Label>
      <Label kind="warning">warning</Label>
      <Label kind="danger">danger</Label>
    </HStack>
  );
}
