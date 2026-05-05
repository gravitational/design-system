import { Grid, HStack, Portal } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import {
  ComposedMenu,
  type ComposedMenuProps,
  Button,
  Menu,
} from '../../../../components';
import { CaretRightIcon, CaretDownIcon } from '../../../../icons';

const hiddenTags = ['!dev', '!docs', '!test'];

const TriggerButton = ({
  size,
  children,
  ...buttonProps
}: React.ComponentProps<typeof Button>) => (
  <Button
    {...buttonProps}
    size={size}
    py={1}
    pl={size === 'sm' ? 3 : 4}
    pr={size === 'sm' ? 1 : 2}
  >
    {children}
    <span aria-hidden>
      <CaretDownIcon />
    </span>
  </Button>
);

const meta = {
  title: 'Components/Overlays/Menu',
  component: ComposedMenu,
  args: {},
} satisfies Meta<typeof ComposedMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export function DefaultMenu(args: ComposedMenuProps) {
  return (
    <ComposedMenu {...args} trigger={<TriggerButton>Actions</TriggerButton>}>
      <Menu.Item value="copy">Copy</Menu.Item>
      <Menu.Item value="paste">Paste</Menu.Item>
      <Menu.Item
        value="delete"
        color="interactive.solid.danger.default"
        _highlighted={{
          bg: 'interactive.tonal.danger.1',
          color: 'interactive.solid.danger.hover',
        }}
      >
        Delete
      </Menu.Item>
    </ComposedMenu>
  );
}
DefaultMenu.tags = hiddenTags;

export const Default: Story = {
  args: { placement: 'bottom-start' },
  parameters: { layout: 'centered' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Actions' });
    await userEvent.click(trigger);
    await waitFor(async () => {
      const item = within(document.body).getByText('Copy');
      await expect(item).toBeVisible();
    });
  },
  render: DefaultMenu,
};

export function WithIcons() {
  return (
    <ComposedMenu trigger={<TriggerButton>Edit</TriggerButton>}>
      <Menu.Item value="cut">
        <span aria-hidden>✂</span>
        <Menu.ItemText>Cut</Menu.ItemText>
        <Menu.ItemCommand>⌘X</Menu.ItemCommand>
      </Menu.Item>
      <Menu.Item value="copy">
        <span aria-hidden>📋</span>
        <Menu.ItemText>Copy</Menu.ItemText>
        <Menu.ItemCommand>⌘C</Menu.ItemCommand>
      </Menu.Item>
      <Menu.Item value="paste">
        <span aria-hidden>📌</span>
        <Menu.ItemText>Paste</Menu.ItemText>
        <Menu.ItemCommand>⌘V</Menu.ItemCommand>
      </Menu.Item>
    </ComposedMenu>
  );
}
WithIcons.parameters = { layout: 'centered', controls: { disable: true } };

export function ItemGroups() {
  return (
    <ComposedMenu trigger={<TriggerButton>Manage</TriggerButton>}>
      <Menu.ItemGroup>
        <Menu.ItemGroupLabel>Cluster</Menu.ItemGroupLabel>
        <Menu.Item value="settings">Settings</Menu.Item>
        <Menu.Item value="users">Users</Menu.Item>
      </Menu.ItemGroup>
      <Menu.Separator />
      <Menu.ItemGroup>
        <Menu.ItemGroupLabel>Resources</Menu.ItemGroupLabel>
        <Menu.Item value="servers">Servers</Menu.Item>
        <Menu.Item value="databases">Databases</Menu.Item>
        <Menu.Item value="apps">Applications</Menu.Item>
      </Menu.ItemGroup>
    </ComposedMenu>
  );
}
ItemGroups.parameters = { layout: 'centered', controls: { disable: true } };

export function CheckboxItems() {
  const [checked, setChecked] = useState<string[]>(['audit']);
  return (
    <ComposedMenu trigger={<TriggerButton>Columns</TriggerButton>}>
      <Menu.ItemGroup>
        <Menu.ItemGroupLabel>Visible columns</Menu.ItemGroupLabel>
        {['Name', 'Status', 'Audit', 'Labels'].map(col => {
          const value = col.toLowerCase();
          return (
            <Menu.CheckboxItem
              key={value}
              value={value}
              checked={checked.includes(value)}
              onCheckedChange={() => {
                setChecked(prev =>
                  prev.includes(value)
                    ? prev.filter(v => v !== value)
                    : [...prev, value]
                );
              }}
              ps={6}
            >
              <Menu.ItemIndicator
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                insetInlineStart={2}
              />
              <Menu.ItemText>{col}</Menu.ItemText>
            </Menu.CheckboxItem>
          );
        })}
      </Menu.ItemGroup>
    </ComposedMenu>
  );
}
CheckboxItems.parameters = { layout: 'centered', controls: { disable: true } };

export function RadioItems() {
  const [sort, setSort] = useState('name');
  return (
    <ComposedMenu trigger={<TriggerButton>Sort by</TriggerButton>}>
      <Menu.RadioItemGroup
        value={sort}
        onValueChange={e => {
          setSort(e.value);
        }}
      >
        {['Name', 'Status', 'Created', 'Last seen'].map(label => {
          const value = label.toLowerCase().replace(' ', '-');
          return (
            <Menu.RadioItem key={value} value={value} ps={6}>
              <Menu.ItemIndicator
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
                insetInlineStart={2}
              />
              <Menu.ItemText>{label}</Menu.ItemText>
            </Menu.RadioItem>
          );
        })}
      </Menu.RadioItemGroup>
    </ComposedMenu>
  );
}
RadioItems.parameters = { layout: 'centered', controls: { disable: true } };

export function WithCommands() {
  return (
    <ComposedMenu trigger={<TriggerButton>File</TriggerButton>}>
      <Menu.Item value="new">
        <Menu.ItemText>New file</Menu.ItemText>
        <Menu.ItemCommand>⌘N</Menu.ItemCommand>
      </Menu.Item>
      <Menu.Item value="open">
        <Menu.ItemText>Open…</Menu.ItemText>
        <Menu.ItemCommand>⌘O</Menu.ItemCommand>
      </Menu.Item>
      <Menu.Separator />
      <Menu.Item value="save">
        <Menu.ItemText>Save</Menu.ItemText>
        <Menu.ItemCommand>⌘S</Menu.ItemCommand>
      </Menu.Item>
      <Menu.Item value="save-as">
        <Menu.ItemText>Save as…</Menu.ItemText>
        <Menu.ItemCommand>⇧⌘S</Menu.ItemCommand>
      </Menu.Item>
    </ComposedMenu>
  );
}
WithCommands.parameters = { layout: 'centered', controls: { disable: true } };

export function NestedSubmenu() {
  return (
    <Menu.Root positioning={{ placement: 'bottom-start' }}>
      <Menu.Trigger asChild>
        <TriggerButton>Actions</TriggerButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="copy">Copy</Menu.Item>
            <Menu.Item value="paste">Paste</Menu.Item>
            <Menu.Separator />

            <Menu.Root positioning={{ placement: 'right-start', gutter: -2 }}>
              <Menu.TriggerItem>
                <Menu.ItemText>Share</Menu.ItemText>
                <span aria-hidden>
                  <CaretRightIcon />
                </span>
              </Menu.TriggerItem>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="email">Email</Menu.Item>
                    <Menu.Item value="slack">Slack</Menu.Item>
                    <Menu.Item value="link">Copy link</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }}>
              <Menu.TriggerItem>
                <Menu.ItemText>Export</Menu.ItemText>
                <span aria-hidden>
                  <CaretRightIcon />
                </span>
              </Menu.TriggerItem>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item value="csv">CSV</Menu.Item>
                    <Menu.Item value="json">JSON</Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
NestedSubmenu.parameters = { layout: 'centered', controls: { disable: true } };

export function ContextMenu() {
  return (
    <Menu.Root>
      <Menu.ContextTrigger
        style={{
          padding: '2rem 4rem',
          border:
            '1px dashed var(--teleport-colors-interactive-tonal-neutral-2)',
          borderRadius: '4px',
          userSelect: 'none',
        }}
      >
        Right-click here
      </Menu.ContextTrigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="inspect">Inspect</Menu.Item>
            <Menu.Item value="refresh">Refresh</Menu.Item>
            <Menu.Separator />
            <Menu.Item
              value="delete"
              color="interactive.solid.danger.default"
              _highlighted={{
                bg: 'interactive.tonal.danger.1',
                color: 'interactive.solid.danger.hover',
              }}
            >
              Delete
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
ContextMenu.parameters = { layout: 'centered', controls: { disable: true } };

export function ControlledMenu(args: ComposedMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <ComposedMenu
      {...args}
      open={open}
      onOpenChange={details => {
        setOpen(details.open);
        args.onOpenChange?.(details);
      }}
      trigger={<TriggerButton>Controlled</TriggerButton>}
    >
      <Menu.Item value="a">Item A</Menu.Item>
      <Menu.Item value="b">Item B</Menu.Item>
    </ComposedMenu>
  );
}
ControlledMenu.tags = hiddenTags;

export const Controlled: Story = {
  args: { onOpenChange: fn() },
  parameters: { layout: 'centered' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Controlled' });
    await userEvent.click(trigger);
    await waitFor(async () => {
      const item = within(document.body).getByText('Item A');
      await expect(item).toBeVisible();
    });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => {
      void expect(args.onOpenChange).toHaveBeenCalled();
    });
  },
  render: ControlledMenu,
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
        <ComposedMenu
          key={placement}
          placement={placement}
          trigger={<TriggerButton size="sm">{placement}</TriggerButton>}
        >
          <Menu.Item value="a">Item A</Menu.Item>
          <Menu.Item value="b">Item B</Menu.Item>
        </ComposedMenu>
      ))}
    </Grid>
  );
}
Placements.parameters = { controls: { disable: true } };

export function Sizes() {
  return (
    <HStack gap={8} align="start">
      <ComposedMenu
        trigger={<TriggerButton size="sm">Size sm</TriggerButton>}
        size="sm"
      >
        <Menu.Item value="a">Small item A</Menu.Item>
        <Menu.Item value="b">Small item B</Menu.Item>
        <Menu.Item value="c">Small item C</Menu.Item>
      </ComposedMenu>
      <ComposedMenu
        trigger={<TriggerButton>Size md (default)</TriggerButton>}
        size="md"
      >
        <Menu.Item value="a">Medium item A</Menu.Item>
        <Menu.Item value="b">Medium item B</Menu.Item>
        <Menu.Item value="c">Medium item C</Menu.Item>
      </ComposedMenu>
    </HStack>
  );
}
Sizes.parameters = { layout: 'centered', controls: { disable: true } };

export function DisabledItems() {
  return (
    <ComposedMenu trigger={<TriggerButton>Options</TriggerButton>}>
      <Menu.Item value="edit">Edit</Menu.Item>
      <Menu.Item value="duplicate">Duplicate</Menu.Item>
      <Menu.Item value="archive" disabled>
        Archive (locked)
      </Menu.Item>
      <Menu.Separator />
      <Menu.Item value="delete" disabled color="fg.error">
        Delete (no permission)
      </Menu.Item>
    </ComposedMenu>
  );
}
DisabledItems.parameters = { layout: 'centered', controls: { disable: true } };

export function OverflowingText() {
  return (
    <ComposedMenu
      trigger={<TriggerButton>Long labels</TriggerButton>}
      contentProps={{ maxW: '260px' }}
    >
      <Menu.Item value="short">Short</Menu.Item>
      <Menu.Item value="long">
        <Menu.ItemText>
          This is a really long menu item label that should truncate with an
          ellipsis
        </Menu.ItemText>
      </Menu.Item>
      <Menu.Item value="long-cmd">
        <Menu.ItemText>
          Another long label that competes with the command for space
        </Menu.ItemText>
        <Menu.ItemCommand>⇧⌘K</Menu.ItemCommand>
      </Menu.Item>
      <Menu.Separator />
      <Menu.Item value="ok">Normal length</Menu.Item>
    </ComposedMenu>
  );
}
OverflowingText.parameters = {
  layout: 'centered',
  controls: { disable: true },
};

export function Compose() {
  return (
    <Menu.Root positioning={{ placement: 'bottom-start' }}>
      <Menu.Trigger asChild>
        <TriggerButton>Full composition</TriggerButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <Menu.ItemGroupLabel>Actions</Menu.ItemGroupLabel>
              <Menu.Item value="copy">
                <Menu.ItemText>Copy</Menu.ItemText>
                <Menu.ItemCommand>⌘C</Menu.ItemCommand>
              </Menu.Item>
              <Menu.Item value="paste">
                <Menu.ItemText>Paste</Menu.ItemText>
                <Menu.ItemCommand>⌘V</Menu.ItemCommand>
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.Separator />
            <Menu.Item value="settings">Settings</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
Compose.parameters = { layout: 'centered', controls: { disable: true } };
