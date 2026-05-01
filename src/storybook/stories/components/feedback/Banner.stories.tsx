import { VStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Banner, ComposedBanner } from '../../../../components';
import { HorseIcon, WarningCircleIcon } from '../../../../icons';

const hiddenTags = ['!dev'];

const meta = {
  title: 'Components/Feedback/Banner',
  component: ComposedBanner,
  args: {
    kind: 'danger',
    title: 'Banner title',
  },
  argTypes: {
    kind: {
      control: 'select',
      options: ['primary', 'neutral', 'danger', 'info', 'warning', 'success'],
    },
  },
} satisfies Meta<typeof ComposedBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Banner',
  parameters: { layout: 'fullscreen' },
};

export function KindsExample() {
  return (
    <VStack align="stretch" gap={2}>
      <ComposedBanner kind="primary" title="Primary banner" />
      <ComposedBanner kind="neutral" title="Neutral banner" />
      <ComposedBanner kind="danger" title="Danger banner" />
      <ComposedBanner kind="info" title="Info banner" />
      <ComposedBanner kind="warning" title="Warning banner" />
      <ComposedBanner kind="success" title="Success banner" />
    </VStack>
  );
}
KindsExample.tags = hiddenTags;

export const Kinds: Story = {
  name: 'Kinds',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  render: KindsExample,
};

export function WithDescriptionExample() {
  return (
    <ComposedBanner
      kind="warning"
      title="Warning banner with description"
      description="This is a description providing additional context."
    />
  );
}
WithDescriptionExample.tags = hiddenTags;

export const WithDescription: Story = {
  name: 'With Description',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  render: WithDescriptionExample,
};

export function ClosableExample() {
  return (
    <ComposedBanner
      kind="info"
      title="Closable banner"
      isClosable
      onClose={fn()}
    />
  );
}
ClosableExample.tags = hiddenTags;

export const Closable: Story = {
  name: 'Closable',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  render: ClosableExample,
};

export function WithSpinnerExample() {
  return <ComposedBanner kind="info" title="Loading..." isLoading />;
}
WithSpinnerExample.tags = hiddenTags;

export const WithSpinner: Story = {
  name: 'With Spinner',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  render: WithSpinnerExample,
};

export function WithCustomIconExample() {
  return (
    <ComposedBanner
      kind="neutral"
      title="Banner with custom icon"
      icon={HorseIcon}
    />
  );
}
WithCustomIconExample.tags = hiddenTags;

export const WithCustomIcon: Story = {
  name: 'With Custom Icon',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  render: WithCustomIconExample,
};

export function ComposeExample() {
  return (
    <Banner.Root kind="danger">
      <Banner.Indicator>
        <WarningCircleIcon />
      </Banner.Indicator>
      <Banner.Content>
        <Banner.Title>Title 1</Banner.Title>
        <Banner.Description>Some content here</Banner.Description>
        <Banner.Title>Title 2</Banner.Title>
        <Banner.Description>Some content here</Banner.Description>
      </Banner.Content>
    </Banner.Root>
  );
}
ComposeExample.tags = hiddenTags;

export const Compose: Story = {
  name: 'Compose mode',
  parameters: { layout: 'fullscreen', controls: { disable: true } },
  render: ComposeExample,
};
