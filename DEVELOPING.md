# Developing

To develop the design system locally, you can either develop with Storybook or override the design system library in
Teleport.

## Setup

### Storybook Development

To develop components in isolation, use Storybook:

```bash
pnpm storybook
```

Stories live in `src/storybook/stories` and follow a hierarchical structure:

```
src/storybook/stories/
  └── components/
      └── component-name/
          ├── ComponentName.mdx          # Documentation for the component
          ├── ComponentName.stories.tsx  # Storybook stories for the component
```

### Teleport Development

To develop components/styles/etc. in the context of Teleport, you can override the design system package using pnpm.

Edit `pnpm-workspace.yaml` in the Teleport repo to add a link to your local design system repo:

```yaml
overrides:
  '@gravitational/design-system': path/to/your/local/design-system
```

Then, in the Teleport repo, run:

```bash
pnpm install
```

This will symlink the design system package to your local copy, allowing you to make changes and see them reflected
in Teleport immediately.

> [!NOTE]
> When using a local override in Teleport, Vite will load the Ubuntu fonts from the design system's node modules, not
> from Teleport's.
> This will error as any directories outside of Teleport's root are not served by Vite.
> If you have cloned `design-system` next to `teleport`, you can fix this by setting `VITE_LOCAL_DESIGN_SYSTEM=1`, e.g.
>
> ```bash
> VITE_LOCAL_DESIGN_SYSTEM=1 pnpm start-teleport
> ```
>
> If you have the `design-system` repo in a different location, instead set `VITE_DESIGN_SYSTEM_DIR` to the path of the
> `design-system` repo.
> For example:
>
> ```bash
> VITE_DESIGN_SYSTEM_DIR=/path/to/design-system pnpm start-teleport
> ```

## Adding icons

The design system exposes icons from the Phosphor icon set. To add new
icons, [follow the documentation](https://design.teleport.dev/?path=/docs/guides-migration-guide--docs#adding-icons).

## Releasing

When you create a PR that includes changes that should be released, add a changeset file by running `pnpm changeset`.
This will guide you through creating a changeset file that describes the changes made and the version bump required.

During the PR process, if a changeset is detected, a comment is automatically added to the PR with the details of the
changeset, including
what the next version will be after the release.

When the PR is merged, the changeset is picked up and the release PR is created automatically.

## Updating the design system in Teleport

The design system is installed in Teleport by a direct URL to the tarball of the package in the GitHub release. This
is to avoid everyone/every build script having to authenticate with GitHub Packages to download the package (GitHub
Packages
does not support anonymous access, even for public packages).

After the release PR is merged, you need to update the version of the design system in Teleport.

## Generating new documentation

There are two ways to create new documentation files for Storybook. Both methods will generate an `.mdx` file and a
`.stories.tsx` file. The difference is if you want the stories to appear in the Storybook sidebar under a component or
have the documentation as a standalone entry.

The generated documentation file (be it standalone or with stories) will have:

- A header with the component name, an optional description, and links to the source and recipe files (you should add
  these if applicable).
- A usage section with a code snippet showing how to import and use the component.
- A placeholder for examples that you can fill in later. Generally, you would create stories in the `.stories.tsx` file
  and then reference them here using the `<Canvas>` component.
- A props table that automatically documents the component's props.

> [!NOTE]
> If you want to override the order of stories in the sidebar, edit `storiesOrder` in `.storybook/preview.tsx`

### Standalone documentation files

If you are creating a documentation file that should appear as a standalone entry in Storybook, you can use
`pnpm create-storybook-doc path/to/doc` to scaffold a new documentation file.

```bash
pnpm create-storybook-doc components/layout/Flex
```

Creates:

```
src/storybook/stories/
  └── components/
      └── layout/
          ├── Flex.mdx          # Documentation for the component
          └── Flex.stories.tsx  # Storybook stories for the component
```

This will appear in the sidebar like:

```
Components
  └── Layout
      └── Flex
```

> [!NOTE]
> Use this method for documentation for simple components that do not require interactive stories.

A good example to follow is the flex documentation.
See [the documentation](./src/storybook/stories/components/layout/Flex.mdx), [the stories](./src/storybook/stories/components/layout/Flex.stories.tsx)
and [the rendered documentation](https://design.teleport.dev/?path=/docs/components-layout-flex--docs).

### Component documentation with stories

If you want the stories to appear under a component in the Storybook sidebar, you can use `--with-stories` flag when
creating the documentation file.

```bash
pnpm create-storybook-doc components/forms/Input --with-stories
```

Assuming there are stories in `Input.stories.tsx` titled "Default" and "Disabled", this will appear in the sidebar like:

```
Components
  └── Forms
      └── Input
          ├── Docs       # The mdx documentation file
          ├── Input      # The main story
          ├── Default    # A variant story
          └── Disabled
```

You can hide individual stories from the sidebar by adding `Story.tags = ['!dev'];` to the story function.

```tsx
export function Example() {
  return (
    <Box>
      <Flex />
    </Box>
  );
}

Example.tags = ['!dev'];
```

> [!NOTE]
> Use this method for documentation for components that require interactive stories to demonstrate their usage.

A good example to follow is the button component.
See [the documentation](./src/storybook/stories/components/buttons/Button.mdx),
[the stories](./src/storybook/stories/components/buttons/Button.stories.tsx)
and [the rendered documentation](https://design.teleport.dev/?path=/docs/components-buttons-button--docs).

#### Story structure

When creating stories for components, use the following structure:

##### Main component story

The main component story will automatically have controls generated for all props. This story should be named after
the component.

```tsx
export const ButtonStory: Story = {
  name: 'Button',
  parameters: {
    layout: 'centered',
  },
};
```

##### Variants

For common variants of the component, create additional stories with predefined args.

```tsx
// We export a separate function here so it can also be used in the documentation mdx file
export function DisabledButtons() {
  return (
    <Grid gridTemplateColumns="repeat(6, auto)" gap={2} w="fit-content">
      <Button disabled fill="filled">
        Primary Filled
      </Button>
      <Button disabled fill="minimal">
        Primary Minimal
      </Button>
    </Grid>
  );
}

DisabledButtons.tags = ['!dev']; // Hide from sidebar

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    disabled: true,
  },
  parameters: {
    layout: 'centered',
    controls: {
      disable: true, // Disable controls for this story as the main story has them
    },
  },
  render: DisabledButtons,
};
```

##### Tests

The main component and variants can have interaction tests defined using the `play` function.

```tsx
export const ButtonStory: Story = {
  name: 'Button',
  args: {
    children: 'Button',
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button');

    await userEvent.click(button);

    await expect(args.onClick).toHaveBeenCalled();
  },
};
```

```tsx
export const Disabled: Story = {
  name: 'Disabled',
  args: {
    children: 'Button',
    disabled: true,
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
    controls: {
      disable: true,
    },
  },
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Primary Filled' });

    await userEvent.click(button);

    await expect(args.onClick).not.toHaveBeenCalled();

    const buttons = canvas.getAllByRole('button');

    for (const button of buttons) {
      await expect(button).toBeDisabled();
    }
  },
  render: DisabledButtons,
};
```

## Additional resources

- [Things to know immediately](https://design.teleport.dev/?path=/docs/guides-things-to-know-immediately--docs)
- [Migration Guide](https://design.teleport.dev/?path=/docs/guides-migration-guide--docs)
- [Design System Documentation](https://design.teleport.dev)
