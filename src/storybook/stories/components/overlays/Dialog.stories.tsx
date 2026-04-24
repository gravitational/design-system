import { Stack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';

import {
  Button,
  CloseButton,
  ComposedDialog,
  type ComposedDialogProps,
  Dialog,
  Field,
  Input,
} from '../../../../components';

const hiddenTags = ['!dev', '!docs', '!test'];

const meta = {
  title: 'Components/Overlays/Dialog',
  component: ComposedDialog,
  args: {},
} satisfies Meta<typeof ComposedDialog>;

export default meta;

export function DefaultDialog() {
  return (
    <ComposedDialog trigger={<Button>Open dialog</Button>}>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
      <Dialog.Header>
        <Dialog.Title>Invite team members</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        Add collaborators to this workspace. They&apos;ll receive an email with
        a link to join and will show up here once they accept.
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button intent="neutral" fill="border">
            Cancel
          </Button>
        </Dialog.ActionTrigger>
        <Dialog.ActionTrigger asChild>
          <Button>Send invites</Button>
        </Dialog.ActionTrigger>
      </Dialog.Footer>
    </ComposedDialog>
  );
}
DefaultDialog.tags = hiddenTags;

export const Default: StoryObj<typeof meta> = {
  parameters: { layout: 'centered' },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Open dialog' });
    await userEvent.click(trigger);
    await waitFor(async () => {
      const body = within(document.body).getByText(/team members/);
      await expect(body).toBeVisible();
    });
  },
  render: DefaultDialog,
};

export function ComposeDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button>Open composed dialog</Button>
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.CloseTrigger asChild>
            <CloseButton size="sm" />
          </Dialog.CloseTrigger>
          <Dialog.Header>
            <Dialog.Title>Update billing details</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            Every slot is placed by hand - useful when you need to wrap the
            content, attach extra handlers, or inject analytics.
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button intent="neutral" fill="border">
                Cancel
              </Button>
            </Dialog.ActionTrigger>
            <Dialog.ActionTrigger asChild>
              <Button>Save changes</Button>
            </Dialog.ActionTrigger>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
}
ComposeDialog.tags = hiddenTags;

export const Compose: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'Open composed dialog',
    });
    await userEvent.click(trigger);
    await waitFor(async () => {
      const body = within(document.body).getByText(
        /Every slot is placed by hand/
      );
      await expect(body).toBeVisible();
    });
  },
  render: ComposeDialog,
};

export function AlertDialogDialog() {
  return (
    <ComposedDialog
      role="alertdialog"
      trigger={<Button intent="danger">Delete project</Button>}
    >
      <Dialog.Header>
        <Dialog.Title>Delete &ldquo;acme-prod&rdquo;?</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        This action cannot be undone. The project, its clusters, and all audit
        logs will be permanently removed.
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button intent="neutral" fill="border">
            Cancel
          </Button>
        </Dialog.ActionTrigger>
        <Dialog.ActionTrigger asChild>
          <Button intent="danger">Delete project</Button>
        </Dialog.ActionTrigger>
      </Dialog.Footer>
    </ComposedDialog>
  );
}
AlertDialogDialog.tags = hiddenTags;

export const AlertDialog: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Delete project' });
    await userEvent.click(trigger);
    await waitFor(async () => {
      const body = within(document.body).getByText(/cannot be undone/);
      await expect(body).toBeVisible();
    });
  },
  render: AlertDialogDialog,
};

export function WithForm() {
  return (
    <ComposedDialog trigger={<Button>Create API token</Button>}>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
      <Dialog.Header>
        <Dialog.Title>Create API token</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Stack gap={4}>
          <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input placeholder="ci-runner" />
            <Field.HelperText>
              Shown in the tokens list. Pick something recognisable.
            </Field.HelperText>
          </Field.Root>
          <Field.Root>
            <Field.Label>Expires in (days)</Field.Label>
            <Input type="number" defaultValue={30} />
          </Field.Root>
        </Stack>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button intent="neutral" fill="border">
            Cancel
          </Button>
        </Dialog.ActionTrigger>
        <Dialog.ActionTrigger asChild>
          <Button>Create token</Button>
        </Dialog.ActionTrigger>
      </Dialog.Footer>
    </ComposedDialog>
  );
}

WithForm.parameters = {
  layout: 'centered',
  controls: { disable: true },
};

export function InitialFocusDialog() {
  const emailRef = useRef<HTMLInputElement>(null);
  return (
    <ComposedDialog
      initialFocusEl={() => emailRef.current}
      trigger={<Button>Open with focused field</Button>}
    >
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
      <Dialog.Header>
        <Dialog.Title>Invite a teammate</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Stack gap={4}>
          <Field.Root>
            <Field.Label>Full name</Field.Label>
            <Input placeholder="Ada Lovelace" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input ref={emailRef} type="email" placeholder="ada@example.com" />
            <Field.HelperText>Focus starts here on open.</Field.HelperText>
          </Field.Root>
        </Stack>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button intent="neutral" fill="border">
            Cancel
          </Button>
        </Dialog.ActionTrigger>
        <Dialog.ActionTrigger asChild>
          <Button>Send invite</Button>
        </Dialog.ActionTrigger>
      </Dialog.Footer>
    </ComposedDialog>
  );
}
InitialFocusDialog.tags = hiddenTags;

export const InitialFocus: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'Open with focused field',
    });
    await userEvent.click(trigger);
    await waitFor(async () => {
      const email = within(document.body).getByPlaceholderText(
        'ada@example.com'
      );
      await expect(email).toHaveFocus();
    });
  },
  render: InitialFocusDialog,
};

export function NestedDialog() {
  return (
    <ComposedDialog trigger={<Button>Open outer dialog</Button>}>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
      <Dialog.Header>
        <Dialog.Title>Edit workspace</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        Some actions need an extra confirmation. Nested dialogs stack on top of
        the parent and restore focus when closed.
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button intent="neutral" fill="border">
            Cancel
          </Button>
        </Dialog.ActionTrigger>
        <ComposedDialog
          role="alertdialog"
          trigger={<Button intent="danger">Transfer ownership</Button>}
        >
          <Dialog.Header>
            <Dialog.Title>Transfer ownership?</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            You&apos;ll lose admin access to this workspace until the new owner
            invites you back.
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.ActionTrigger asChild>
              <Button intent="neutral" fill="border">
                Go back
              </Button>
            </Dialog.ActionTrigger>
            <Dialog.ActionTrigger asChild>
              <Button intent="danger">Yes, transfer</Button>
            </Dialog.ActionTrigger>
          </Dialog.Footer>
        </ComposedDialog>
      </Dialog.Footer>
    </ComposedDialog>
  );
}
NestedDialog.tags = hiddenTags;

export const Nested: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const outerTrigger = canvas.getByRole('button', {
      name: 'Open outer dialog',
    });
    await userEvent.click(outerTrigger);
    await waitFor(async () => {
      const outer = within(document.body).getByText(
        /Some actions need an extra confirmation/
      );
      await expect(outer).toBeVisible();
    });
    const innerTrigger = within(document.body).getByRole('button', {
      name: 'Transfer ownership',
    });
    await userEvent.click(innerTrigger);
    await waitFor(async () => {
      const inner = within(document.body).getByText(/lose admin access/);
      await expect(inner).toBeVisible();
    });
  },
  render: NestedDialog,
};

export function HideBackdrop() {
  return (
    <ComposedDialog
      hideBackdrop
      trigger={<Button>Open without backdrop</Button>}
    >
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
      <Dialog.Header>
        <Dialog.Title>No backdrop</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        Clicks behind this dialog pass through to the underlying page.
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button>Got it</Button>
        </Dialog.ActionTrigger>
      </Dialog.Footer>
    </ComposedDialog>
  );
}

HideBackdrop.parameters = {
  layout: 'centered',
  controls: { disable: true },
};

export function PersistContentDialog() {
  const [count, setCount] = useState(0);
  return (
    <ComposedDialog
      unmountOnExit={false}
      trigger={<Button>Open counter dialog</Button>}
    >
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
      <Dialog.Header>
        <Dialog.Title>Persistent state</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Stack gap={2}>
          <div>Count: {count}</div>
          <Button
            onClick={() => {
              setCount(c => c + 1);
            }}
          >
            Increment
          </Button>
        </Stack>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button>Close</Button>
        </Dialog.ActionTrigger>
      </Dialog.Footer>
    </ComposedDialog>
  );
}
PersistContentDialog.tags = hiddenTags;

export const PersistContent: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Open counter dialog' });
    await userEvent.click(trigger);
    const increment = await waitFor(() =>
      within(document.body).getByRole('button', { name: 'Increment' })
    );
    await userEvent.click(increment);
    await waitFor(async () => {
      await expect(
        within(document.body).getByText('Count: 1')
      ).toBeInTheDocument();
    });
    await userEvent.keyboard('{Escape}');
    await userEvent.click(trigger);
    // Count survives close/reopen - would reset to 0 without unmountOnExit=false.
    await waitFor(async () => {
      await expect(
        within(document.body).getByText('Count: 1')
      ).toBeInTheDocument();
    });
  },
  render: PersistContentDialog,
};

export function DisableCloseDialog() {
  return (
    <ComposedDialog
      closeOnEscape={false}
      closeOnInteractOutside={false}
      trigger={<Button>Open undismissable dialog</Button>}
    >
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
      <Dialog.Header>
        <Dialog.Title>Can&apos;t dismiss me</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        Neither Escape nor a backdrop click will close this dialog - you must
        pick an action below.
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button intent="neutral" fill="border">
            Cancel
          </Button>
        </Dialog.ActionTrigger>
        <Dialog.ActionTrigger asChild>
          <Button intent="danger">Discard changes</Button>
        </Dialog.ActionTrigger>
      </Dialog.Footer>
    </ComposedDialog>
  );
}
DisableCloseDialog.tags = hiddenTags;

export const DisableClose: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'Open undismissable dialog',
    });
    await userEvent.click(trigger);
    await waitFor(async () => {
      const body = within(document.body).getByText(/Can't dismiss me/);
      await expect(body).toBeVisible();
    });
    await userEvent.keyboard('{Escape}');
    // Dialog should still be visible.
    const body = within(document.body).getByText(/Can't dismiss me/);
    await expect(body).toBeVisible();
  },
  render: DisableCloseDialog,
};

export function OpenChangeDialog(args: ComposedDialogProps) {
  return (
    <ComposedDialog {...args} trigger={<Button>Open change dialog</Button>}>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
      <Dialog.Header>
        <Dialog.Title>Open change</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        Press Escape or click outside - <code>onOpenChange</code> fires with the
        new open state.
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button>Close</Button>
        </Dialog.ActionTrigger>
      </Dialog.Footer>
    </ComposedDialog>
  );
}
OpenChangeDialog.tags = hiddenTags;

export const OpenChange: StoryObj<typeof meta> = {
  args: { onOpenChange: fn() },
  parameters: { layout: 'centered' },
  play: async ({ args, canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', {
      name: 'Open change dialog',
    });
    await userEvent.click(trigger);
    await waitFor(async () => {
      const body = within(document.body).getByText(/Press Escape/);
      await expect(body).toBeVisible();
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      void expect(args.onOpenChange).toHaveBeenCalledWith(
        expect.objectContaining({ open: false })
      );
    });
  },
  render: OpenChangeDialog,
};

export function ControlledDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Stack gap={4} align="start">
      <Button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open from external state
      </Button>
      <ComposedDialog
        open={open}
        onOpenChange={details => {
          setOpen(details.open);
        }}
      >
        <Dialog.CloseTrigger asChild>
          <CloseButton size="sm" />
        </Dialog.CloseTrigger>
        <Dialog.Header>
          <Dialog.Title>Controlled dialog</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          Driven by a parent-owned `open` state. No DOM trigger is rendered by
          the dialog itself.
        </Dialog.Body>
        <Dialog.Footer>
          <Button
            intent="neutral"
            fill="border"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Save
          </Button>
        </Dialog.Footer>
      </ComposedDialog>
    </Stack>
  );
}
ControlledDialog.tags = hiddenTags;

export const Controlled: StoryObj<typeof meta> = {
  parameters: { layout: 'centered', controls: { disable: true } },
  play: async ({ canvas, userEvent }) => {
    const openButton = canvas.getByRole('button', {
      name: 'Open from external state',
    });
    await userEvent.click(openButton);
    await waitFor(async () => {
      const body = within(document.body).getByText(/Driven by a parent-owned/);
      await expect(body).toBeVisible();
    });
    const cancel = within(document.body).getByRole('button', {
      name: 'Cancel',
    });
    await userEvent.click(cancel);
    await waitFor(async () => {
      await expect(
        within(document.body).queryByText(/Driven by a parent-owned/)
      ).toBeNull();
    });
  },
  render: ControlledDialog,
};
