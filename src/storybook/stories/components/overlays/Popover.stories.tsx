import { Grid, HStack, Portal, Stack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';

import {
  Button,
  CloseButton,
  ComposedPopover,
  type ComposedPopoverProps,
  Field,
  Input,
  Popover,
} from '../../../../components';

const hiddenTags = ['!dev', '!docs', '!test'];

const meta = {
  title: 'Components/Overlays/Popover',
  component: ComposedPopover,
  args: {},
} satisfies Meta<typeof ComposedPopover>;

export default meta;

export function DefaultPopover(args: ComposedPopoverProps) {
  return (
    <ComposedPopover {...args} trigger={<Button>Resource tips</Button>}>
      <Popover.Body>
        <Popover.Title fontWeight="bold">Finding resources</Popover.Title>
        <div>
          Use the search bar to filter by labels, names, or kinds - for example{' '}
          <code>env:prod kind:db</code>.
        </div>
      </Popover.Body>
    </ComposedPopover>
  );
}
DefaultPopover.tags = hiddenTags;

export const Default: StoryObj<typeof meta> = {
  args: { placement: 'bottom-start' },
  parameters: { layout: 'centered' },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Resource tips' });
    await userEvent.click(trigger);
    await waitFor(async () => {
      const body = within(document.body).getByText(/filter by labels/i);
      await expect(body).toBeVisible();
    });
  },
  render: DefaultPopover,
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
        <ComposedPopover
          key={placement}
          placement={placement}
          trigger={<Button size="sm">{placement}</Button>}
        >
          <Popover.Body>{placement}</Popover.Body>
        </ComposedPopover>
      ))}
    </Grid>
  );
}
Placements.parameters = { controls: { disable: true } };

export function ArrowPopover() {
  return (
    <HStack gap={8}>
      <ComposedPopover placement="bottom" trigger={<Button>With arrow</Button>}>
        <Popover.Body>
          <Popover.Title fontWeight="bold">With arrow</Popover.Title>
          <div>Arrow points at the trigger.</div>
        </Popover.Body>
      </ComposedPopover>
      <ComposedPopover
        placement="bottom"
        showArrow={false}
        trigger={<Button>No arrow</Button>}
      >
        <Popover.Body>
          <Popover.Title fontWeight="bold">No arrow</Popover.Title>
          <div>No arrow here.</div>
        </Popover.Body>
      </ComposedPopover>
    </HStack>
  );
}
ArrowPopover.tags = hiddenTags;

export const Arrow: StoryObj<typeof meta> = {
  parameters: { controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    // Both popovers' content trees are always mounted (Ark default), so scope
    // the arrow-tip check to whichever popover is currently open.
    const openArrowTip =
      '[data-scope="popover"][data-part="content"][data-state="open"] [data-part="arrow-tip"]';

    const noArrowTrigger = canvas.getByRole('button', { name: 'No arrow' });
    await userEvent.click(noArrowTrigger);
    await waitFor(async () => {
      await expect(
        within(document.body).getByText('No arrow here.')
      ).toBeVisible();
    });
    await expect(document.body.querySelector(openArrowTip)).toBeNull();

    const withArrowTrigger = canvas.getByRole('button', { name: 'With arrow' });
    await userEvent.click(withArrowTrigger);
    await waitFor(async () => {
      await expect(
        within(document.body).getByText('Arrow points at the trigger.')
      ).toBeVisible();
      await expect(document.body.querySelector(openArrowTip)).not.toBeNull();
    });
  },
  render: ArrowPopover,
};

export function ComposePopover() {
  return (
    <Popover.Root positioning={{ placement: 'bottom-start' }}>
      <Popover.Trigger asChild>
        <Button>Open composed popover</Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Popover.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Popover.CloseTrigger>
            <Popover.Header>Session recording</Popover.Header>
            <Popover.Body>
              Fine-grained control over each slot - useful when you need custom
              headers, close buttons, or extra handlers.
            </Popover.Body>
            <Popover.Footer>Last sync: 2m ago</Popover.Footer>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
ComposePopover.tags = hiddenTags;

export const Compose: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'Open composed popover',
    });
    await userEvent.click(trigger);
    await waitFor(async () => {
      const body = within(document.body).getByText(/Fine-grained control/);
      await expect(body).toBeVisible();
    });
  },
  render: ComposePopover,
};

export function ControlledPopover(args: ComposedPopoverProps) {
  const [open, setOpen] = useState(false);
  return (
    <ComposedPopover
      {...args}
      open={open}
      onOpenChange={details => {
        setOpen(details.open);
        args.onOpenChange?.(details);
      }}
      placement="bottom"
      trigger={<Button>Toggle (controlled)</Button>}
    >
      <Popover.Body>
        Driven by parent-owned state - mirrors teleterm usage.
      </Popover.Body>
    </ComposedPopover>
  );
}
ControlledPopover.tags = hiddenTags;

export const Controlled: StoryObj<typeof meta> = {
  args: { onOpenChange: fn() },
  parameters: { layout: 'centered' },
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: 'Toggle (controlled)' });
    await userEvent.click(toggle);
    await waitFor(async () => {
      const body = within(document.body).getByText(/parent-owned state/);
      await expect(body).toBeVisible();
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      void expect(args.onOpenChange).toHaveBeenCalled();
    });
  },
  render: ControlledPopover,
};

export function Layout() {
  return (
    <ComposedPopover
      placement="bottom-start"
      trigger={<Button>View cluster status</Button>}
    >
      <Popover.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Popover.CloseTrigger>
      <Popover.Header>Cluster: teleport-prod</Popover.Header>
      <Popover.Body>
        All 4 auth servers are healthy. Last heartbeat received 12 seconds ago.
      </Popover.Body>
      <Popover.Footer>Region: us-east-1</Popover.Footer>
    </ComposedPopover>
  );
}
Layout.parameters = { layout: 'centered', controls: { disable: true } };

export function WithForm() {
  return (
    <ComposedPopover
      placement="bottom-start"
      trigger={<Button>Rename resource</Button>}
      contentProps={{ minW: '280px' }}
    >
      <Popover.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Popover.CloseTrigger>
      <Popover.Header>Rename resource</Popover.Header>
      <Popover.Body>
        <Stack gap={3}>
          <Field.Root>
            <Field.Label>Display name</Field.Label>
            <Input defaultValue="teleport-prod" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Description</Field.Label>
            <Input placeholder="Optional" />
          </Field.Root>
        </Stack>
      </Popover.Body>
      <Popover.Footer>
        <HStack justify="flex-end" gap={2}>
          <Button intent="neutral" fill="border">
            Cancel
          </Button>
          <Button>Save</Button>
        </HStack>
      </Popover.Footer>
    </ComposedPopover>
  );
}
WithForm.parameters = { layout: 'centered', controls: { disable: true } };

export function InitialFocusPopover() {
  const acceptRef = useRef<HTMLButtonElement>(null);
  return (
    <ComposedPopover
      placement="bottom"
      initialFocusEl={() => acceptRef.current}
      trigger={<Button>Review update</Button>}
      contentProps={{ minW: '280px' }}
    >
      <Popover.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Popover.CloseTrigger>
      <Popover.Header>Auto-update ready</Popover.Header>
      <Popover.Body>Restart to finish updating now.</Popover.Body>
      <Popover.Footer>
        <HStack justify="flex-end" gap={2}>
          <Button intent="neutral" fill="border">
            Later
          </Button>
          <Button ref={acceptRef}>Restart now</Button>
        </HStack>
      </Popover.Footer>
    </ComposedPopover>
  );
}
InitialFocusPopover.tags = hiddenTags;

export const InitialFocus: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Review update' });
    await userEvent.click(trigger);
    await waitFor(async () => {
      const accept = within(document.body).getByRole('button', {
        name: 'Restart now',
      });
      await expect(accept).toHaveFocus();
    });
  },
  render: InitialFocusPopover,
};

export function NestedPopover() {
  return (
    <ComposedPopover
      placement="bottom-start"
      trigger={<Button>Open outer popover</Button>}
    >
      <Popover.Body>
        <Stack gap={3}>
          <div>Need a hand? The nested popover has more detail.</div>
          <ComposedPopover
            placement="right"
            trigger={
              <Button fill="border" intent="neutral">
                Show more
              </Button>
            }
          >
            <Popover.Body>
              Nested popovers stack on top of the parent and close
              independently. Focus returns to the trigger on dismiss.
            </Popover.Body>
          </ComposedPopover>
        </Stack>
      </Popover.Body>
    </ComposedPopover>
  );
}
NestedPopover.tags = hiddenTags;

export const Nested: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const outerTrigger = canvas.getByRole('button', {
      name: 'Open outer popover',
    });
    await userEvent.click(outerTrigger);
    await waitFor(async () => {
      const outer = within(document.body).getByText(/Need a hand/);
      await expect(outer).toBeVisible();
    });
    const innerTrigger = within(document.body).getByRole('button', {
      name: 'Show more',
    });
    await userEvent.click(innerTrigger);
    await waitFor(async () => {
      const inner = within(document.body).getByText(/Nested popovers stack/);
      await expect(inner).toBeVisible();
    });
  },
  render: NestedPopover,
};

export function Positioning() {
  return (
    <HStack gap={8}>
      <ComposedPopover
        placement="bottom"
        gutter={16}
        trigger={<Button>gutter 16</Button>}
      >
        <Popover.Body>Extra distance from the trigger.</Popover.Body>
      </ComposedPopover>
      <ComposedPopover
        positioning={{
          placement: 'bottom-start',
          flip: false,
          overflowPadding: 24,
        }}
        trigger={<Button>Full positioning escape hatch</Button>}
      >
        <Popover.Body>
          The positioning prop spreads last and wins over flat props.
        </Popover.Body>
      </ComposedPopover>
    </HStack>
  );
}
Positioning.parameters = { layout: 'centered', controls: { disable: true } };
