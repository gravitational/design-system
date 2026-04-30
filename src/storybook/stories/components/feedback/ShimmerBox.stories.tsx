import { Stack } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

import { ShimmerBox } from '../../../../components';

const meta = {
  title: 'Components/Feedback/Shimmer Box',
  component: ShimmerBox,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ShimmerBox>;

export default meta;

export function Default() {
  return <ShimmerBox width="320px" height="40px" />;
}
Default.tags = ['!dev'];

export function ListItem() {
  return (
    <Stack gap={3} width="320px">
      <ShimmerBox height="20px" width="60%" />
      <ShimmerBox height="14px" />
      <ShimmerBox height="14px" width="80%" />
    </Stack>
  );
}
ListItem.tags = ['!dev'];
