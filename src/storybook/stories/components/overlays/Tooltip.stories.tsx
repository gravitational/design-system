import { Grid, HStack, VStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, waitFor, within } from 'storybook/test';

import { Button, Tooltip, type TooltipProps } from '../../../../components';

const hiddenTags = ['!dev', '!docs', '!test'];

const meta = {
  title: 'Components/Overlays/Tooltip',
  component: Tooltip,
  args: {
    content: 'Tooltip content',
  },
} satisfies Meta<typeof Tooltip>;

export default meta;

export function DefaultTooltip(args: TooltipProps) {
  return (
    <Tooltip {...args}>
      <Button>Hover me</Button>
    </Tooltip>
  );
}
DefaultTooltip.tags = hiddenTags;

export const Default: StoryObj<typeof meta> = {
  parameters: { layout: 'centered' },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Hover me' });
    await userEvent.hover(trigger);
    await waitFor(async () => {
      const tip = within(document.body).getByText('Tooltip content');
      await expect(tip).toBeVisible();
    });
  },
  render: DefaultTooltip,
};

const placements = [
  'top-start',
  'top',
  'top-end',
  'right-start',
  'right',
  'right-end',
  'bottom-start',
  'bottom',
  'bottom-end',
  'left-start',
  'left',
  'left-end',
] as const;

export function Placements() {
  return (
    <Grid gridTemplateColumns="repeat(3, auto)" gap={8} p={24}>
      {placements.map(placement => (
        <Tooltip key={placement} placement={placement} content={placement}>
          <Button size="sm">{placement}</Button>
        </Tooltip>
      ))}
    </Grid>
  );
}

Placements.parameters = {
  controls: { disable: true },
};

export function Arrow() {
  return (
    <HStack gap={8}>
      <Tooltip placement="bottom" content="With arrow">
        <Button>With arrow</Button>
      </Tooltip>
      <Tooltip placement="bottom" showArrow={false} content="No arrow">
        <Button>No arrow</Button>
      </Tooltip>
    </HStack>
  );
}

Arrow.parameters = {
  controls: { disable: true },
};

export function Gutter() {
  return (
    <HStack gap={8}>
      <Tooltip
        placement="bottom"
        gutter={0}
        content="Flush against the trigger"
      >
        <Button>gutter 0</Button>
      </Tooltip>
      <Tooltip placement="bottom" gutter={16} content="Extra distance">
        <Button>gutter 16</Button>
      </Tooltip>
    </HStack>
  );
}

Gutter.parameters = {
  controls: { disable: true },
};

export function DisabledTooltip() {
  return (
    <Tooltip disabled content="You should never see this">
      <Button>No tooltip (disabled)</Button>
    </Tooltip>
  );
}
DisabledTooltip.tags = hiddenTags;

export const Disabled: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'No tooltip (disabled)',
    });
    await userEvent.hover(trigger);
    // Wait past any default openDelay to be sure no tooltip appears.
    await new Promise(resolve => setTimeout(resolve, 1000));
    await expect(
      within(document.body).queryByText('You should never see this')
    ).toBeNull();
  },
  render: DisabledTooltip,
};

export function RichContentTooltip() {
  return (
    <Tooltip
      placement="bottom"
      content={
        <div>
          <strong>Rich content</strong>
          <div>ReactNode content is accepted, not just strings.</div>
        </div>
      }
    >
      <Button>Hover for rich content</Button>
    </Tooltip>
  );
}
RichContentTooltip.tags = hiddenTags;

export const RichContent: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'Hover for rich content',
    });
    await userEvent.hover(trigger);
    await waitFor(async () => {
      const heading = within(document.body).getByText('Rich content');
      await expect(heading).toBeVisible();
      const sub = within(document.body).getByText(
        /ReactNode content is accepted/
      );
      await expect(sub).toBeVisible();
    });
  },
  render: RichContentTooltip,
};

export function ControlledTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <VStack gap={4}>
      <Button
        onClick={() => {
          setOpen(o => !o);
        }}
      >
        Toggle tooltip
      </Button>
      <Tooltip
        open={open}
        onOpenChange={details => {
          setOpen(details.open);
        }}
        content="Driven by parent-owned state"
      >
        <Button intent="neutral">Hover target</Button>
      </Tooltip>
    </VStack>
  );
}
ControlledTooltip.tags = hiddenTags;

export const Controlled: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: 'Toggle tooltip' });
    await userEvent.click(toggle);
    await waitFor(async () => {
      const tip = within(document.body).getByText(
        'Driven by parent-owned state'
      );
      await expect(tip).toBeVisible();
    });
    await userEvent.click(toggle);
    await waitFor(async () => {
      await expect(
        within(document.body).queryByText('Driven by parent-owned state')
      ).toBeNull();
    });
  },
  render: ControlledTooltip,
};
