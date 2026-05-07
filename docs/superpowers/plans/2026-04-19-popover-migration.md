# Popover Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Teleport's Popover into `@gravitational/design-system` as a thin Chakra UI v3 wrapper with a simplified API (compositional, `trigger=` convenience, imperative `anchorRef`) plus flat `placement`/`gutter` shortcuts shared with Tooltip.

**Architecture:** Thin wrapper around Chakra v3's `Popover.*` (Floating-UI via `@zag-js/popper`) backed by a slot recipe registered with the package theme. The wrapper resolves three usage modes into Chakra primitives and merges flat positioning props into Chakra's full `positioning` config with the escape hatch winning on conflict. Same shortcut pattern applied to `Tooltip`.

**Tech Stack:** TypeScript, React 19, `@chakra-ui/react@^3.31.0`, `@ark-ui/react`, Storybook (Vite), `vitest`.

**Spec:** `docs/superpowers/specs/2026-04-19-popover-migration-design.md`

---

## File Structure

Files created:

- `src/components/popover/recipe.ts` — slot recipe (content/arrow/header/body/footer styling)
- `src/components/popover/Popover.tsx` — wrapper component + sub-component re-exports
- `src/components/popover/index.ts` — barrel
- `src/storybook/stories/components/overlays/Popover.stories.tsx` — stories

Files modified:

- `src/theme/slotRecipes.ts` — register `popover: popoverSlotRecipe`
- `src/components/index.ts` — export popover barrel
- `src/components/tooltip/Tooltip.tsx` — add `placement`/`gutter` shortcuts

No migrations in Teleport consumers are in scope (see spec §"Migration notes").

---

### Task 1: Add `popoverSlotRecipe`

**Goal:** Create the Chakra v3 slot recipe that gives our popover its Teleport look — elevated surface, 4px radius, medium shadow, header/body/footer dividers, native arrow matching the content background.

**Files:**

- Create: `src/components/popover/recipe.ts`

**Acceptance Criteria:**

- [ ] Exports `popoverSlotRecipe` via `defineSlotRecipe` with `popoverAnatomy.keys()`
- [ ] `className` is `'teleport-popover'` (matches `tooltipSlotRecipe` pattern)
- [ ] `content` slot uses `levels.elevated` background, `md` shadow, `sm` (4px) radius, `popover` z-index
- [ ] `content` slot animates via `scale-fade-in` / `scale-fade-out` at `fast` duration on `_open` / `_closed`
- [ ] `arrow` slot background variable points at `levels.elevated`
- [ ] `arrowTip` slot border uses `interactive.tonal.neutral.1`
- [ ] `header` and `footer` slots have 1px dividers in `interactive.tonal.neutral.0`
- [ ] `header` font weight `bold`
- [ ] `closeTrigger` slot positions top-end inside content

**Verify:**

```bash
pnpm generate-theme
pnpm type-check
```

Both should succeed without errors. Typegen will emit updated recipe types under `styled-system`.

**Steps:**

- [ ] **Step 1: Create the recipe file.**

Create `src/components/popover/recipe.ts`:

```ts
import { defineSlotRecipe } from '@chakra-ui/react';
import { popoverAnatomy } from '@chakra-ui/react/anatomy';

export const popoverSlotRecipe = defineSlotRecipe({
  className: 'teleport-popover',
  slots: popoverAnatomy.keys(),
  base: {
    content: {
      '--popover-bg': 'colors.levels.elevated',
      bg: 'var(--popover-bg)',
      color: 'text.main',
      boxShadow: 'md',
      borderRadius: 'sm',
      minW: '16',
      zIndex: 'popover',
      outline: 'none',
      transformOrigin: 'var(--transform-origin)',
      _open: {
        animationStyle: 'scale-fade-in',
        animationDuration: 'fast',
      },
      _closed: {
        animationStyle: 'scale-fade-out',
        animationDuration: 'fast',
      },
    },
    arrow: {
      '--arrow-size': 'sizes.2',
      '--arrow-background': 'var(--popover-bg)',
    },
    arrowTip: {
      borderTopWidth: '1px',
      borderInlineStartWidth: '1px',
      borderColor: 'interactive.tonal.neutral.1',
    },
    header: {
      px: 4,
      py: 3,
      borderBottomWidth: '1px',
      borderColor: 'interactive.tonal.neutral.0',
      fontWeight: 'bold',
    },
    body: {
      px: 4,
      py: 3,
    },
    footer: {
      px: 4,
      py: 3,
      borderTopWidth: '1px',
      borderColor: 'interactive.tonal.neutral.0',
    },
    closeTrigger: {
      position: 'absolute',
      top: 2,
      insetEnd: 2,
    },
  },
});
```

- [ ] **Step 2: Verify typegen and type-check.**

```bash
pnpm generate-theme
pnpm type-check
```

Expected: both commands exit 0. `pnpm generate-theme` runs `chakra typegen` against `src/themes/teleport/theme.ts` — at this point the recipe is not yet registered in `slotRecipes`, so typegen will not emit popover slot types. That's fine; Task 2 registers it.

---

### Task 2: Register `popoverSlotRecipe` in the theme

**Goal:** Hook the recipe into the package theme so `chakra typegen` emits typed classes and runtime styling resolves.

**Files:**

- Modify: `src/theme/slotRecipes.ts`

**Acceptance Criteria:**

- [ ] `popoverSlotRecipe` imported from `../components/popover/recipe`
- [ ] `popover: popoverSlotRecipe` entry added to `slotRecipes`, alphabetical (between `list` and `table`)

**Verify:**

```bash
pnpm generate-theme
pnpm type-check
```

Typegen should produce the popover slot types. Type-check should pass.

**Steps:**

- [ ] **Step 1: Edit `src/theme/slotRecipes.ts`.**

Replace the file contents with:

```ts
import { blockquoteSlotRecipe } from '../components/blockquote/recipe';
import { listSlotRecipe } from '../components/list/recipe';
import { popoverSlotRecipe } from '../components/popover/recipe';
import { tableSlotRecipe } from '../components/table/recipe';
import { tooltipSlotRecipe } from '../components/tooltip/recipe';

export const slotRecipes = {
  blockquote: blockquoteSlotRecipe,
  list: listSlotRecipe,
  popover: popoverSlotRecipe,
  table: tableSlotRecipe,
  tooltip: tooltipSlotRecipe,
};
```

- [ ] **Step 2: Regenerate theme types and type-check.**

```bash
pnpm generate-theme
pnpm type-check
```

Expected: both exit 0.

---

### Task 3: Implement the `Popover` wrapper

**Goal:** Build the three-mode wrapper component plus a custom `Popover.Content` that internally handles `Portal` + `Positioner` + optional arrow, so callers can drop straight from `<Popover>` into `<Popover.Content>` without writing the full Chakra tree.

**Files:**

- Create: `src/components/popover/Popover.tsx`
- Create: `src/components/popover/index.ts`

**Acceptance Criteria:**

- [ ] `Popover` accepts `PopoverProps` (defined inline per spec)
- [ ] `Popover.Content` is a custom component that wraps `<Portal><ChakraPopover.Positioner><ChakraPopover.Content>…</ChakraPopover.Content></ChakraPopover.Positioner></Portal>` and renders an `Arrow` + `ArrowTip` when `showArrow` is `true`
- [ ] `Popover.Content` accepts its own `showArrow`, `portalled`, `portalRef` props (defaults: `true`, `true`, `undefined`)
- [ ] `Popover.Trigger`, `Popover.Header`, `Popover.Body`, `Popover.Footer`, `Popover.CloseTrigger`, `Popover.Arrow`, `Popover.ArrowTip`, `Popover.Title`, `Popover.Description`, `Popover.Anchor`, `Popover.Positioner` attached as static properties pointing at `ChakraPopover.*` (escape hatches for users who want the raw primitives)
- [ ] Mode precedence matches spec: `anchorRef` > `trigger` > compositional children
- [ ] In convenience (`trigger=`) and `anchorRef` modes, the wrapper auto-injects `<Popover.Content>` around `children`, forwarding `showArrow`, `portalled`, `portalRef`, and `contentProps`
- [ ] In compositional mode (no `trigger` and no `anchorRef`), `children` are rendered as direct children of `ChakraPopover.Root` — the caller writes their own `Popover.Trigger` and `Popover.Content`
- [ ] Positioning merge: `placement`/`gutter` shortcuts fill defaults; user-supplied `positioning` spreads last, so `positioning.placement` overrides a flat `placement`
- [ ] `anchorRef`-derived `getAnchorRect` is placed _before_ the user's `positioning`, so a user `positioning.getAnchorRect` still wins
- [ ] `portalled` defaults to `true`; `showArrow` defaults to `true` (both on `Popover` and on `Popover.Content`)

**Verify:**

```bash
pnpm type-check
```

Expected: 0 errors.

**Steps:**

- [ ] **Step 1: Create `src/components/popover/Popover.tsx`.**

```tsx
import { Popover as ChakraPopover, Portal } from '@chakra-ui/react';
import type { ReactNode, RefAttributes, RefObject } from 'react';

type PositioningOptions = NonNullable<ChakraPopover.RootProps['positioning']>;
type Placement = NonNullable<PositioningOptions['placement']>;

export interface PopoverProps extends Omit<
  ChakraPopover.RootProps,
  'positioning' | 'children'
> {
  /**
   * Placement shortcut. Feeds `positioning.placement`. A user-supplied
   * `positioning.placement` wins on conflict.
   */
  placement?: Placement;
  /**
   * Distance-from-anchor shortcut (px). Feeds `positioning.gutter`. A
   * user-supplied `positioning.gutter` wins on conflict.
   */
  gutter?: number;
  /** Full Chakra positioning config. Overrides flat shortcuts. */
  positioning?: PositioningOptions;
  /**
   * Render an arrow. Only applies when the wrapper auto-injects
   * `Popover.Content` (convenience / anchorRef modes). In compositional
   * mode, pass `showArrow` directly to `<Popover.Content>` instead.
   */
  showArrow?: boolean;
  /** Render content in a Portal. Default `true`. */
  portalled?: boolean;
  /** Target container for the Portal. */
  portalRef?: RefObject<HTMLElement | null>;
  /**
   * Imperative anchor element. When set, no `ChakraPopover.Trigger` is
   * rendered; the popover positions itself against the ref.
   */
  anchorRef?: RefObject<HTMLElement | null>;
  /**
   * Convenience: element wrapped in `<ChakraPopover.Trigger asChild>`.
   * Ignored when `anchorRef` is provided.
   */
  trigger?: ReactNode;
  /**
   * Forwarded to the auto-injected `<Popover.Content>` in convenience /
   * anchorRef modes. Ignored in compositional mode.
   */
  contentProps?: ChakraPopover.ContentProps;
  /** Popover body (auto-wrapped in `Popover.Content` in convenience modes). */
  children?: ReactNode;
}

function mergePositioning(
  placement: Placement | undefined,
  gutter: number | undefined,
  anchorRef: RefObject<HTMLElement | null> | undefined,
  positioning: PositioningOptions | undefined
): PositioningOptions {
  return {
    ...(placement !== undefined && { placement }),
    ...(gutter !== undefined && { gutter }),
    ...(anchorRef && {
      getAnchorRect: () => anchorRef.current?.getBoundingClientRect() ?? null,
    }),
    ...positioning,
  };
}

export interface PopoverContentProps extends ChakraPopover.ContentProps {
  /** Render an arrow + arrow tip inside this content. Default `true`. */
  showArrow?: boolean;
  /** Render this content in a Portal. Default `true`. */
  portalled?: boolean;
  /** Target container for the Portal. */
  portalRef?: RefObject<HTMLElement | null>;
}

export function PopoverContent({
  showArrow = true,
  portalled = true,
  portalRef,
  children,
  ref,
  ...rest
}: PopoverContentProps & RefAttributes<HTMLDivElement>) {
  return (
    <Portal disabled={!portalled} container={portalRef}>
      <ChakraPopover.Positioner>
        <ChakraPopover.Content ref={ref} {...rest}>
          {showArrow && (
            <ChakraPopover.Arrow>
              <ChakraPopover.ArrowTip />
            </ChakraPopover.Arrow>
          )}
          {children}
        </ChakraPopover.Content>
      </ChakraPopover.Positioner>
    </Portal>
  );
}

export function Popover({
  placement,
  gutter,
  positioning,
  showArrow = true,
  portalled = true,
  portalRef,
  anchorRef,
  trigger,
  contentProps,
  children,
  ref,
  ...rest
}: PopoverProps & RefAttributes<HTMLDivElement>) {
  const mergedPositioning = mergePositioning(
    placement,
    gutter,
    anchorRef,
    positioning
  );

  // Compositional mode — caller supplies Trigger + Content themselves.
  if (anchorRef === undefined && trigger === undefined) {
    return (
      <ChakraPopover.Root positioning={mergedPositioning} {...rest}>
        {children}
      </ChakraPopover.Root>
    );
  }

  return (
    <ChakraPopover.Root positioning={mergedPositioning} {...rest}>
      {anchorRef === undefined && trigger !== undefined && (
        <ChakraPopover.Trigger asChild>{trigger}</ChakraPopover.Trigger>
      )}
      <PopoverContent
        ref={ref}
        showArrow={showArrow}
        portalled={portalled}
        portalRef={portalRef}
        {...contentProps}
      >
        {children}
      </PopoverContent>
    </ChakraPopover.Root>
  );
}

Popover.Trigger = ChakraPopover.Trigger;
Popover.Content = PopoverContent;
Popover.Positioner = ChakraPopover.Positioner;
Popover.Header = ChakraPopover.Header;
Popover.Body = ChakraPopover.Body;
Popover.Footer = ChakraPopover.Footer;
Popover.CloseTrigger = ChakraPopover.CloseTrigger;
Popover.Arrow = ChakraPopover.Arrow;
Popover.ArrowTip = ChakraPopover.ArrowTip;
Popover.Title = ChakraPopover.Title;
Popover.Description = ChakraPopover.Description;
Popover.Anchor = ChakraPopover.Anchor;
```

Rationale:

- **Compositional mode** drops `children` straight into `ChakraPopover.Root`. Callers write `<Popover.Trigger>` + `<Popover.Content>` as children — `Popover.Content` is our wrapper, so they still don't have to think about Portal / Positioner.
- **Convenience / anchorRef modes** auto-inject `<Popover.Content>` around `children` and forward `showArrow`, `portalled`, `portalRef`, and `contentProps`. `ref` forwards onto the inner `ChakraPopover.Content`.
- **Raw primitives** (`Popover.Positioner`, `ChakraPopover.Content`) stay reachable via `Popover.Positioner` and direct Chakra imports, so power users can bypass our wrapper when they need to.

- [ ] **Step 2: Create `src/components/popover/index.ts`.**

```ts
export * from './Popover';
```

- [ ] **Step 3: Type-check.**

```bash
pnpm type-check
```

Expected: 0 errors. If `NonNullable<ChakraPopover.RootProps['positioning']>` fails to resolve (it will if typegen hasn't picked up the recipe), re-run `pnpm generate-theme` first.

---

### Task 4: Re-export popover from the components barrel

**Goal:** Make `Popover` importable from `@gravitational/design-system`.

**Files:**

- Modify: `src/components/index.ts`

**Acceptance Criteria:**

- [ ] `export * from './popover';` added in alphabetical order
- [ ] `pnpm type-check` passes

**Verify:**

```bash
pnpm type-check
```

**Steps:**

- [ ] **Step 1: Edit `src/components/index.ts`.**

Replace the file with (alphabetical, inserting `popover` between `layout` and `table`):

```ts
export * from './button';
export * from './code';
export * from './container';
export * from './forms';
export * from './layout';
export * from './popover';
export * from './table';
export * from './tooltip';
export * from './typography';
```

- [ ] **Step 2: Type-check.**

```bash
pnpm type-check
```

Expected: 0 errors.

---

### Task 5: Add `placement`/`gutter` shortcuts to `Tooltip`

**Goal:** Mirror the Popover positioning shortcut API on `Tooltip` so both components have the same surface.

**Files:**

- Modify: `src/components/tooltip/Tooltip.tsx`

**Acceptance Criteria:**

- [ ] `TooltipProps` gains `placement?: Placement` and `gutter?: number`, both derived from `ChakraTooltip.RootProps['positioning']`
- [ ] `positioning` remains on the props type and, when supplied, wins over flat shortcuts
- [ ] All existing Tooltip stories still render without visual regression
- [ ] `pnpm type-check` passes

**Verify:**

```bash
pnpm type-check
pnpm storybook  # spot-check: existing Tooltip stories render unchanged
```

**Steps:**

- [ ] **Step 1: Rewrite `src/components/tooltip/Tooltip.tsx`.**

```tsx
import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import { type ReactNode, type RefAttributes, type RefObject } from 'react';

type TooltipPositioning = NonNullable<ChakraTooltip.RootProps['positioning']>;
type TooltipPlacement = NonNullable<TooltipPositioning['placement']>;

export interface TooltipProps extends Omit<
  ChakraTooltip.RootProps,
  'positioning'
> {
  /**
   * Placement shortcut. Feeds `positioning.placement`. A user-supplied
   * `positioning.placement` wins on conflict.
   */
  placement?: TooltipPlacement;
  /** Distance-from-anchor shortcut (px). Feeds `positioning.gutter`. */
  gutter?: number;
  /** Full Chakra positioning config. Overrides flat shortcuts. */
  positioning?: TooltipPositioning;
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
  content: ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
}

function mergePositioning(
  placement: TooltipPlacement | undefined,
  gutter: number | undefined,
  positioning: TooltipPositioning | undefined
): TooltipPositioning | undefined {
  if (placement === undefined && gutter === undefined && !positioning) {
    return undefined;
  }
  return {
    ...(placement !== undefined && { placement }),
    ...(gutter !== undefined && { gutter }),
    ...positioning,
  };
}

export function Tooltip({
  showArrow = true,
  children,
  disabled,
  portalled = true,
  content,
  contentProps,
  portalRef,
  placement,
  gutter,
  positioning,
  ref,
  ...rest
}: TooltipProps & RefAttributes<HTMLDivElement>) {
  if (disabled || !content) {
    return children;
  }

  const mergedPositioning = mergePositioning(placement, gutter, positioning);

  return (
    <ChakraTooltip.Root positioning={mergedPositioning} {...rest}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraTooltip.Positioner>
          <ChakraTooltip.Content ref={ref} {...contentProps}>
            {showArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  );
}
```

- [ ] **Step 2: Type-check.**

```bash
pnpm type-check
```

Expected: 0 errors.

- [ ] **Step 3: Spot-check existing Tooltip stories render unchanged.**

```bash
pnpm storybook
```

Open the Tooltip stories in the browser. They should look identical to before — `placement` and `gutter` are opt-in.

---

### Task 6: Write Popover Storybook stories

**Goal:** Cover every usage mode and knob so Storybook serves as both demo and regression test. Follows the shape of `Button.stories.tsx`.

**Files:**

- Create: `src/storybook/stories/components/overlays/Popover.stories.tsx`

**Acceptance Criteria:**

- [ ] `Default` story: compositional mode, click-to-open, play fn clicks the trigger and asserts content is visible
- [ ] `Placements` story: 12 placements in a grid (`top`, `top-start`, `top-end`, `right`, `right-start`, `right-end`, `bottom`, `bottom-start`, `bottom-end`, `left`, `left-start`, `left-end`)
- [ ] `WithArrow` / `WithoutArrow` story toggling `showArrow`
- [ ] `Convenience` story using `trigger=` prop
- [ ] `Controlled` story using controlled `open`/`onOpenChange` + `anchorRef`; play fn toggles state and asserts content appears/disappears
- [ ] `Layout` story with Header / Body / Footer / CloseTrigger composed
- [ ] `Positioning` story demonstrating both the `gutter` shortcut and a full `positioning={{ placement, flip: false, overflowPadding: 24 }}` override
- [ ] All stories use the existing package entry (`../../../../components`) for imports
- [ ] `pnpm test` passes (Storybook test runner covers play functions)

**Verify:**

```bash
pnpm type-check
pnpm test --project=storybook
pnpm storybook  # visual spot-check
```

**Steps:**

- [ ] **Step 1: Create the stories file.**

Create `src/storybook/stories/components/overlays/Popover.stories.tsx`:

```tsx
import { Grid, HStack, VStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn } from 'storybook/test';

import { Button, Popover } from '../../../../components';

const meta = {
  title: 'Components/Overlays/Popover',
  component: Popover,
  args: {
    showArrow: true,
    portalled: true,
  },
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Default',
  args: {
    placement: 'bottom-start',
  },
  parameters: {
    layout: 'centered',
  },
  render: args => (
    <Popover {...args}>
      <Popover.Trigger asChild>
        <Button>Open popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Body>Hello from the popover.</Popover.Body>
      </Popover.Content>
    </Popover>
  ),
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Open popover' });
    await userEvent.click(trigger);
    const body = await canvas.findByText('Hello from the popover.');
    await expect(body).toBeVisible();
  },
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
        <Popover key={placement} placement={placement}>
          <Popover.Trigger asChild>
            <Button size="sm">{placement}</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Body>{placement}</Popover.Body>
          </Popover.Content>
        </Popover>
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
      <Popover placement="bottom" showArrow>
        <Popover.Trigger asChild>
          <Button>With arrow</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Body>Arrow points at the trigger.</Popover.Body>
        </Popover.Content>
      </Popover>
      <Popover placement="bottom" showArrow={false}>
        <Popover.Trigger asChild>
          <Button>No arrow</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Body>No arrow here.</Popover.Body>
        </Popover.Content>
      </Popover>
    </HStack>
  );
}

Arrow.parameters = {
  controls: { disable: true },
};

export function Convenience() {
  return (
    <Popover
      trigger={<Button>Convenience trigger</Button>}
      placement="bottom-start"
      gutter={8}
    >
      The <code>trigger=</code> prop wraps this element in a Chakra trigger
      automatically.
    </Popover>
  );
}

Convenience.parameters = {
  layout: 'centered',
  controls: { disable: true },
};

export const Controlled: Story = {
  name: 'Controlled with anchorRef',
  args: {
    onOpenChange: fn(),
  },
  parameters: {
    layout: 'centered',
  },
  render: function ControlledStory(args) {
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    return (
      <VStack gap={4}>
        <Button ref={anchorRef} onClick={() => setOpen(o => !o)}>
          Toggle (controlled)
        </Button>
        <Popover
          {...args}
          open={open}
          onOpenChange={details => {
            setOpen(details.open);
            args.onOpenChange?.(details);
          }}
          anchorRef={anchorRef}
          placement="bottom"
        >
          Driven by imperative ref — mirrors teleterm usage.
        </Popover>
      </VStack>
    );
  },
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole('button', { name: 'Toggle (controlled)' });
    await userEvent.click(toggle);
    const body = await canvas.findByText(
      'Driven by imperative ref — mirrors teleterm usage.'
    );
    await expect(body).toBeVisible();
    await expect(args.onOpenChange).toHaveBeenCalled();
  },
};

export function Layout() {
  return (
    <Popover placement="bottom-start">
      <Popover.Trigger asChild>
        <Button>Open with layout</Button>
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Header>Popover title</Popover.Header>
        <Popover.Body>
          Body content sits between header and footer. Each slot has its own
          divider.
        </Popover.Body>
        <Popover.Footer>
          <Popover.CloseTrigger asChild>
            <Button fill="minimal">Close</Button>
          </Popover.CloseTrigger>
        </Popover.Footer>
      </Popover.Content>
    </Popover>
  );
}

Layout.parameters = {
  layout: 'centered',
  controls: { disable: true },
};

export function Positioning() {
  return (
    <HStack gap={8}>
      <Popover placement="bottom" gutter={16}>
        <Popover.Trigger asChild>
          <Button>gutter={16}</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Body>Extra distance from the trigger.</Popover.Body>
        </Popover.Content>
      </Popover>
      <Popover
        positioning={{
          placement: 'bottom-start',
          flip: false,
          overflowPadding: 24,
        }}
      >
        <Popover.Trigger asChild>
          <Button>Full positioning escape hatch</Button>
        </Popover.Trigger>
        <Popover.Content>
          <Popover.Body>
            <code>positioning=</code> spreads last and wins over flat props.
          </Popover.Body>
        </Popover.Content>
      </Popover>
    </HStack>
  );
}

Positioning.parameters = {
  layout: 'centered',
  controls: { disable: true },
};
```

- [ ] **Step 2: Type-check.**

```bash
pnpm type-check
```

Expected: 0 errors.

- [ ] **Step 3: Run Storybook test runner.**

```bash
pnpm test --project=storybook
```

Expected: all stories, including the `Default` and `Controlled` play functions, pass.

- [ ] **Step 4: Spot-check visually.**

```bash
pnpm storybook
```

Navigate to `Components → Overlays → Popover`. Verify:

- Default opens on click, closes on outside click and Escape.
- Placements grid shows arrows pointing at the correct side for each cell.
- Arrow toggle renders with and without arrow.
- Layout story shows header divider, body, footer divider, and a working close button.

---

## Spec coverage check

| Spec section                    | Covered by                                                       |
| ------------------------------- | ---------------------------------------------------------------- |
| Architecture / file layout      | Task 1 (recipe), Task 3 (component), Task 6 (stories)            |
| Slot recipe styling             | Task 1                                                           |
| Recipe registration             | Task 2                                                           |
| Compositional API               | Task 3 Step 2; Task 6 `Default`, `Placements`, `Arrow`, `Layout` |
| Convenience `trigger=` API      | Task 3; Task 6 `Convenience`                                     |
| Controlled `anchorRef` API      | Task 3; Task 6 `Controlled`                                      |
| Mode precedence rule            | Task 3 Step 1 + Step 2                                           |
| Positioning merge rule          | Task 3 (mergePositioning); Task 5 (Tooltip equivalent)           |
| Static sub-component re-exports | Task 3 Step 1 tail                                               |
| Package barrel export           | Task 4                                                           |
| Tooltip API alignment           | Task 5                                                           |
| Storybook depth matching Button | Task 6                                                           |

No spec section is without a task.
