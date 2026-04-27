import { VStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Alert, ComposedAlert } from '../../../../components';
import { HorseIcon, WarningCircleIcon } from '../../../../icons';

const hiddenTags = ['!dev'];

const meta = {
  title: 'Components/Notices/Alert',
  component: ComposedAlert,
  args: {
    kind: 'danger',
    title: 'Alert title',
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['success', 'danger', 'info', 'warning', 'neutral', 'cta'],
    },
  },
} satisfies Meta<typeof ComposedAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Alert',
  parameters: {
    layout: 'padded',
  },
};

export function KindsExample() {
  return (
    <VStack align="stretch" gap={4}>
      <ComposedAlert kind="danger" title="Danger alert" />
      <ComposedAlert kind="info" title="Info alert" />
      <ComposedAlert kind="warning" title="Warning alert" />
      <ComposedAlert kind="success" title="Success alert" />
      <ComposedAlert kind="neutral" title="Neutral alert" />
      <ComposedAlert kind="cta" title="CTA alert" />
    </VStack>
  );
}
KindsExample.tags = hiddenTags;

export const Kinds: Story = {
  name: 'Kinds',
  parameters: { controls: { disable: true } },
  render: KindsExample,
};

export function WithDescriptionExample() {
  return (
    <VStack align="stretch" gap={4}>
      <ComposedAlert
        kind="danger"
        title="Danger alert with description"
        description="This is a description providing additional context."
      />
      <ComposedAlert
        kind="info"
        title="Info alert with description"
        description="This is a description providing additional context."
      />
    </VStack>
  );
}
WithDescriptionExample.tags = hiddenTags;

export const WithDescription: Story = {
  name: 'With Description',
  parameters: { controls: { disable: true } },
  render: WithDescriptionExample,
};

export function ClosableExample() {
  return (
    <ComposedAlert
      kind="info"
      title="Closable alert"
      isClosable
      onClose={fn()}
    />
  );
}
ClosableExample.tags = hiddenTags;

export const Closable: Story = {
  name: 'Closable',
  parameters: { controls: { disable: true } },
  render: ClosableExample,
};

export function WithSpinnerExample() {
  return <ComposedAlert kind="info" title="Loading..." isLoading />;
}
WithSpinnerExample.tags = hiddenTags;

export const WithSpinner: Story = {
  name: 'With Spinner',
  parameters: { controls: { disable: true } },
  render: WithSpinnerExample,
};

export function WithCustomIconExample() {
  return (
    <ComposedAlert
      kind="neutral"
      title="Alert with custom icon"
      icon={HorseIcon}
    />
  );
}
WithCustomIconExample.tags = hiddenTags;

export const WithCustomIcon: Story = {
  name: 'With Custom Icon',
  parameters: { controls: { disable: true } },
  render: WithCustomIconExample,
};

export function ComposeExample() {
  return (
    <Alert.Root kind="warning">
      <Alert.Indicator>
        <WarningCircleIcon />
      </Alert.Indicator>
      <Alert.Content>
        <Alert.Title>Title 1</Alert.Title>
        <Alert.Description>Some content here</Alert.Description>
        <Alert.Title>Title 2</Alert.Title>
        <Alert.Description>Some content here</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}
ComposeExample.tags = hiddenTags;

export const Compose: Story = {
  name: 'Compose mode',
  parameters: { controls: { disable: true } },
  render: ComposeExample,
};
