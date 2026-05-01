import { Stack } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

import {
  Caption,
  H1,
  H2,
  H3,
  H4,
  Overline,
  P1,
  P2,
  P3,
  Subtitle1,
  Subtitle2,
  Subtitle3,
  Text,
} from '../../../..';

const meta = {
  title: 'Components/Typography/Text',
  component: Text,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Text>;

export default meta;

const sample = 'The quick brown fox jumps over the lazy dog.';

export function Headings() {
  return (
    <Stack gap={3} align="stretch">
      <H1>H1 - {sample}</H1>
      <H2>H2 - {sample}</H2>
      <H3>H3 - {sample}</H3>
      <H4>H4 - {sample}</H4>
    </Stack>
  );
}
Headings.tags = ['!dev'];

export function Subtitles() {
  return (
    <Stack gap={3} align="stretch">
      <Subtitle1>Subtitle1 - {sample}</Subtitle1>
      <Subtitle2>Subtitle2 - {sample}</Subtitle2>
      <Subtitle3>Subtitle3 - {sample}</Subtitle3>
    </Stack>
  );
}
Subtitles.tags = ['!dev'];

export function Body() {
  return (
    <Stack gap={3} align="stretch">
      <P1>P1 - {sample}</P1>
      <P2>P2 - {sample}</P2>
      <P3>P3 - {sample}</P3>
    </Stack>
  );
}
Body.tags = ['!dev'];

export function CaptionExample() {
  return <Caption>Caption - {sample}</Caption>;
}
CaptionExample.tags = ['!dev'];

export function OverlineExample() {
  return <Overline>Overline - {sample}</Overline>;
}
OverlineExample.tags = ['!dev'];
