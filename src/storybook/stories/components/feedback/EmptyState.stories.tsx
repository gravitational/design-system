import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, ComposedEmptyState, EmptyState } from '../../../../components';
import { MagnifyingGlassFillIcon, HardDrivesFillIcon } from '../../../../icons';
import { VStack } from '@chakra-ui/react';

const meta = {
  title: 'Components/Feedback/Empty State',
  component: ComposedEmptyState,
  args: {
    title: 'No results found',
  },
} satisfies Meta<typeof ComposedEmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Empty State',
};

export function WithDescriptionExample() {
  return (
    <ComposedEmptyState
      title={`No results match "agent-demonstration-target"`}
      description="Try adjusting your search or filters."
      icon={MagnifyingGlassFillIcon}
    />
  );
}
WithDescriptionExample.tags = ['!dev'];

export const WithDescription: Story = {
  render: WithDescriptionExample,
};

export function WithActionExample() {
  return (
    <ComposedEmptyState
      icon={HardDrivesFillIcon}
      title="No resources yet"
      description="Add a resource to get started."
    >
      <Button>Add resource</Button>
    </ComposedEmptyState>
  );
}
WithActionExample.tags = ['!dev'];

export const WithAction: Story = {
  render: WithActionExample,
};

export function ComposeExample() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <MagnifyingGlassFillIcon />
        </EmptyState.Indicator>
        <VStack gap={1}>
          <EmptyState.Title>No results found</EmptyState.Title>
          <EmptyState.Description>
            Try adjusting your search or filters.
          </EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}
ComposeExample.tags = ['!dev'];

export const Compose: Story = {
  name: 'Compose mode',
  render: ComposeExample,
};
