# Popover Migration — Design Spec

Status: approved, ready for plan
Date: 2026-04-19

## Context

Teleport's `web/packages/design/src/Popover` is a ~900-line class component built on
styled-components and a custom `Modal`. It exposes an MUI-style positioning API
(`anchorEl` + dual `anchorOrigin`/`transformOrigin` props) and hand-rolls the
arrow with CSS mask-image gymnastics. Consumers: `Tooltip` internals
(`IconTooltip`, shared tooltip plumbing), `MenuLogin`, and teleterm's TopBar
(`Identity`, `Clusters`, `Connections`), which drive the popover
programmatically from imperative refs.

The design-system package (this repo) already provides a thin `Tooltip` wrapper
over Chakra UI v3's `Tooltip.*` slots plus a `tooltipSlotRecipe`. We want the
same treatment for Popover: idiomatic Chakra v3 underneath, Teleport styling
via a slot recipe, and a pleasant API that keeps the Teleport consumers
migratable.

## Goals

- Ship a `Popover` component that wraps Chakra v3's `Popover.*` (Floating
  UI–based).
- Teleport visual parity: elevated surface, shadow, 4px radius, arrow.
- Support three call patterns:
  1. Compositional (Chakra idiomatic, happy path)
  2. `trigger=` convenience (like our `Tooltip`)
  3. Controlled + imperative `anchorRef` (for programmatic triggers)
- Simplify positioning for both Popover _and_ Tooltip: expose `placement` and
  `gutter` as flat props, keep Chakra's full `positioning` object as an
  escape hatch.

## Non-goals

- Porting existing Teleport consumers to the new component. Those are separate
  PRs in the Teleport repo.
- Re-implementing Teleport's custom CSS mask-image arrow. Chakra's native
  arrow is visually equivalent and stays consistent with `Tooltip`.
- Changing the Modal/Backdrop behaviour of Teleport's current Popover. Chakra
  v3's popover handles outside-click, focus, and escape-key dismissal natively;
  we do not need a backdrop element.

## Architecture

File layout mirrors `components/tooltip`:

```
src/components/popover/
  Popover.tsx
  recipe.ts           # popoverSlotRecipe
  index.ts
src/storybook/stories/components/overlays/Popover.stories.tsx
```

Touch points elsewhere:

- `src/theme/slotRecipes.ts` — register `popover: popoverSlotRecipe`.
- `src/components/index.ts` — add `export * from './popover';`.

No changes to global theme tokens. The recipe consumes existing
`levels.elevated`, `boxShadow`, `interactive.tonal.neutral.*` tokens.

## Public API

### Compositional (happy path)

```tsx
<Popover>
  <Popover.Trigger asChild>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Popover.Header>Title</Popover.Header>
    <Popover.Body>Content goes here.</Popover.Body>
    <Popover.Footer>
      <Popover.CloseTrigger asChild>
        <Button>Close</Button>
      </Popover.CloseTrigger>
    </Popover.Footer>
  </Popover.Content>
</Popover>
```

`Popover.Trigger`, `Content`, `Header`, `Body`, `Footer`, `CloseTrigger`,
`Arrow`, `ArrowTip` are re-exports of the corresponding Chakra v3 parts,
attached as static properties on `Popover`.

### Convenience (`trigger=` prop)

```tsx
<Popover trigger={<Button>Open</Button>} placement="bottom-start" gutter={8}>
  Body content.
</Popover>
```

Internally wraps `trigger` in `<ChakraPopover.Trigger asChild>` and wraps
children in `<Popover.Content>` automatically. If the caller also wants custom
`Header`/`Footer` slots, they should use compositional mode instead.

### Controlled with imperative `anchorRef`

```tsx
const anchorRef = useRef<HTMLElement>(null);
const [open, setOpen] = useState(false);

<>
  <button ref={anchorRef}>Anchor</button>
  <Popover
    open={open}
    onOpenChange={({ open }) => setOpen(open)}
    anchorRef={anchorRef}
    placement="bottom-start"
  >
    Body content.
  </Popover>
</>;
```

When `anchorRef` is passed, the component does not render a
`ChakraPopover.Trigger`; instead it wires
`positioning.getAnchorRect = () => anchorRef.current?.getBoundingClientRect()`.
This matches the imperative pattern used by teleterm today and keeps the
existing Teleport consumers migratable with a local edit rather than a
rewrite of surrounding components.

### Mode precedence

If more than one of `anchorRef`, `trigger`, and compositional children is
used, the component resolves as follows:

1. `anchorRef` wins. No Chakra trigger is rendered; content is portalled and
   positioned against the ref. A `trigger` prop passed alongside is ignored
   (documented as caller error).
2. Otherwise, if `trigger` is set, it is wrapped in
   `<ChakraPopover.Trigger asChild>` and `children` is wrapped in
   `<Popover.Content>`.
3. Otherwise, `children` is rendered verbatim — the caller is expected to
   include `<Popover.Trigger>` and `<Popover.Content>` themselves.

### Props

```ts
import type { Popover as ChakraPopover, Portal } from '@chakra-ui/react';
import type { Placement, PositioningOptions } from '@chakra-ui/react';

interface PopoverProps extends Omit<ChakraPopover.RootProps, 'positioning'> {
  /** Placement shortcut. Feeds `positioning.placement`. */
  placement?: Placement;
  /** Distance-from-anchor shortcut. Feeds `positioning.gutter`. */
  gutter?: number;
  /** Full Chakra positioning config. Wins over flat shortcuts on conflict. */
  positioning?: PositioningOptions;

  /** Render an arrow pointing at the anchor. Default: true. */
  showArrow?: boolean;

  /** Render content in a Portal. Default: true. */
  portalled?: boolean;
  /** Target container for the Portal. */
  portalRef?: RefObject<HTMLElement | null>;

  /** Imperative anchor. When set, no Chakra trigger is rendered. */
  anchorRef?: RefObject<HTMLElement | null>;

  /** Convenience: element wrapped in `<ChakraPopover.Trigger asChild>`. */
  trigger?: ReactNode;

  /** Forwarded to `<ChakraPopover.Content>`. */
  contentProps?: ChakraPopover.ContentProps;
}
```

### Positioning merge rule

```ts
const mergedPositioning: PositioningOptions = {
  ...(placement !== undefined && { placement }),
  ...(gutter !== undefined && { gutter }),
  ...(anchorRef && {
    getAnchorRect: () => anchorRef.current?.getBoundingClientRect() ?? null,
  }),
  ...positioning,
};
```

`positioning` spreads last, so an explicit `positioning={{ placement: 'top' }}`
overrides a flat `placement="bottom"`. This is the single documented rule.
`getAnchorRect` from `positioning` also wins over the `anchorRef`-derived one,
preserving escape-hatch power.

## Recipe (slot styling)

```ts
import { defineSlotRecipe } from '@chakra-ui/react';
import { popoverAnatomy } from '@chakra-ui/react/anatomy';

export const popoverSlotRecipe = defineSlotRecipe({
  slots: popoverAnatomy.keys(),
  className: 'teleport-popover',
  base: {
    content: {
      '--popover-bg': 'colors.levels.elevated',
      bg: 'var(--popover-bg)',
      color: 'text.main',
      boxShadow: 'boxShadow.1',
      borderRadius: 'sm', // 4px
      minW: '16',
      zIndex: 'popover',
      transformOrigin: 'var(--transform-origin)',
      _open: { animationStyle: 'scale-fade-in', animationDuration: 'fast' },
      _closed: { animationStyle: 'scale-fade-out', animationDuration: 'fast' },
    },
    arrow: {
      '--arrow-size': 'sizes.2',
      '--arrow-background': 'var(--popover-bg)',
    },
    arrowTip: {
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

Register in `src/theme/slotRecipes.ts`:

```ts
import { popoverSlotRecipe } from '../components/popover/recipe';

export const slotRecipes = {
  blockquote: blockquoteSlotRecipe,
  list: listSlotRecipe,
  popover: popoverSlotRecipe,
  table: tableSlotRecipe,
  tooltip: tooltipSlotRecipe,
};
```

## Tooltip alignment

Same two shortcuts land on `Tooltip`:

```ts
interface TooltipProps extends Omit<ChakraTooltip.RootProps, 'positioning'> {
  placement?: Placement;
  gutter?: number;
  positioning?: PositioningOptions;
  // existing props unchanged
}
```

Merge rule identical to Popover's. Existing Tooltip stories continue to render
unchanged because `placement`/`gutter` are optional and no defaults change.

## Stories

`src/storybook/stories/components/overlays/Popover.stories.tsx`:

1. **Default** — compositional, click-to-open. Play fn clicks the trigger and
   asserts the content appears.
2. **Placements** — 12-cell grid exercising every placement value.
3. **Arrow** — toggle showing `showArrow=true` vs `false` side by side.
4. **Convenience** — `<Popover trigger={…}>…</Popover>` form.
5. **Controlled + anchorRef** — controlled `open`, imperative ref; demonstrates
   the teleterm migration path.
6. **Layout** — Header/Body/Footer/CloseTrigger fully composed.
7. **Positioning** — shows `gutter={16}` and a full-power
   `positioning={{ placement: 'bottom-start', flip: false, overflowPadding: 24 }}`.

All stories use `layout: 'centered'` where sensible. Play functions follow the
pattern in `Button.stories.tsx` (canvas + `userEvent` + `expect`).

## Testing strategy

- Type-check (`pnpm type-check`) gates the type-level contract.
- Storybook test (`pnpm test`) runs play functions for the Default and
  Controlled stories, verifying open/close behaviour and that the content
  renders into the portal with the correct placement attribute.
- No separate unit test file; Storybook test runner is the standard pattern in
  this repo (see `Button.stories.tsx`).

## Migration notes (Teleport side, out of scope for this PR)

- Consumers using `anchorEl={el}` + `open={bool}` swap to
  `anchorRef={ref}` + `open={bool}` + `onOpenChange`.
- Consumers using `anchorOrigin`/`transformOrigin` pick a single `placement`.
  Mapping:
  - `anchorOrigin={bottom,left} + transformOrigin={top,left}` → `placement="bottom-start"`
  - `anchorOrigin={bottom,center} + transformOrigin={top,center}` → `placement="bottom"`
  - `anchorOrigin={bottom,right} + transformOrigin={top,right}` → `placement="bottom-end"`
  - (same pattern for top/left/right)
- `growDirections` and `updatePositionOnChildResize` have no direct equivalent;
  Chakra's Floating UI positioning handles resize automatically. If a consumer
  relied on `growDirections="top-left"`, they pick a `placement` in the
  top-left quadrant instead.
- `popoverMargin` → `gutter`.

These mappings will be performed in follow-up Teleport PRs, not here.

## Risks

- **Chakra arrow vs Teleport arrow:** the CSS mask approach in Teleport allows
  the popover to keep transparency on gradients. The Chakra arrow is a solid
  triangle matching the content background. On Teleport's typical elevated
  surfaces this is not visually distinguishable, and our `Tooltip` already
  uses the Chakra arrow, so this is internally consistent.
- **`positioning` precedence confusion:** mitigated by a single documented
  rule (`positioning` wins) and by surfacing it in the JSDoc on each prop.

## Open questions

None remaining. All decisions above were validated with the user during
brainstorming on 2026-04-19.
