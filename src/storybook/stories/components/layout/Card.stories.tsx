import type { Meta } from '@storybook/react-vite';

import { Card, ComposedCard, Text } from '../../../..';

const hiddenTags = ['!dev'];

const meta = {
  title: 'Components/Layout/Card',
  component: ComposedCard,
} satisfies Meta<typeof ComposedCard>;

export default meta;

export function DefaultExample() {
  return (
    <ComposedCard title="Card title">
      The quick brown fox jumps over the lazy dog.
    </ComposedCard>
  );
}
DefaultExample.tags = hiddenTags;

export function ComposeExample() {
  return (
    <Card.Root>
      <Card.Header px={5} pt={5}>
        <Card.Title>Card title</Card.Title>
        <Card.Description>Description text</Card.Description>
      </Card.Header>
      <Card.Body p={5}>
        <Text>The quick brown fox jumps over the lazy dog.</Text>
      </Card.Body>
      <Card.Footer px={5} pb={5} gap={2}>
        <Text>Footer content</Text>
      </Card.Footer>
    </Card.Root>
  );
}
ComposeExample.tags = hiddenTags;
