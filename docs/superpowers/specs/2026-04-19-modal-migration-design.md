# Modal Migration — Design Spec

Status: approved, ready for plan
Date: 2026-04-19

## Context

Teleport's `web/packages/design/src` has two related components:

- **`Modal`** — a ~460-line class component that handles portal, focus trap,
  focus restore, escape key, and backdrop click. Styled-components. Used
  directly by `Popover` and (until the recent migration) wrapped by `Dialog`.
- **`Dialog`** — wraps `Modal` with a centered `DialogBox`
  (`levels.surface`, 8px radius, 32/24 padding, large shadow,
  `max-height: calc(100% - 96px)`), defaults `disableBackdropClick` and
  `disableEscapeKeyDown` to `true`. This is the component consumers use.

`DialogConfirmation`, `DialogTitle`, `DialogHeader`, `DialogContent`, and
`DialogFooter` are small styled helpers around it.

Chakra UI v3's `Dialog.*` primitives already handle everything Teleport's
`Modal` class did — portal, focus trap, focus restore, escape/backdrop
interception, unmount-on-exit. So we need exactly one wrapper: the new
`Modal` component in this package _replaces_ Teleport's `Dialog` (and
obviates the need to port the low-level `Modal` primitive).

## Goals

- Ship a `Modal` component that wraps Chakra v3's `Dialog.*`.
- Preserve Teleport `Dialog`'s full API surface — every prop gets a path
  through — so migrating consumers don't lose functionality.
- Follow **Chakra's defaults** (Escape closes, backdrop click closes,
  focus trap on) rather than Teleport's (both close disabled) — per the
  design decision on 2026-04-19.
- Same look as Teleport: elevated surface, 8px radius, 32/24 padding,
  big shadow, max-h 96px below viewport.
- Mirror the Popover API shape: compositional happy path + `trigger=`
  convenience mode.

## Non-goals

- Porting Teleport consumers. ~40 files import `design/Dialog` or
  `design/DialogConfirmation`; their migration is separate PRs.
- Reimplementing Teleport's focus-trap edge cases (programmatic focus
  theft reversion, cross-boundary Tab wrapping). Chakra's focus trap is
  standard and sufficient; no consumer depends on Teleport's quirks.
- Porting `DialogConfirmation`. Teleport added it solely to re-enable
  Escape that Teleport's `Dialog` had disabled. We default Escape to
  enabled, so the wrapper becomes redundant.

## Architecture

File layout mirrors `components/popover`:

```
src/components/modal/
  Modal.tsx
  recipe.ts           # modalSlotRecipe
  index.ts
src/storybook/stories/components/overlays/Modal.stories.tsx
src/storybook/stories/components/overlays/Modal.mdx
```

Touch points elsewhere:

- `src/theme/slotRecipes.ts` — register `modal: modalSlotRecipe`
- `src/components/index.ts` — `export * from './modal';`

## Public API

### Compositional (happy path)

```tsx
<Modal>
  <Modal.Trigger asChild>
    <Button>Open</Button>
  </Modal.Trigger>
  <Modal.Backdrop />
  <Modal.Positioner>
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>Title</Modal.Title>
      </Modal.Header>
      <Modal.Body>Body content.</Modal.Body>
      <Modal.Footer>
        <Modal.CloseTrigger asChild>
          <Button>Close</Button>
        </Modal.CloseTrigger>
      </Modal.Footer>
    </Modal.Content>
  </Modal.Positioner>
</Modal>
```

`Modal.Trigger`, `Backdrop`, `Positioner`, `Content`, `Header`, `Body`,
`Footer`, `Title`, `Description`, `CloseTrigger`, `ActionTrigger` are
attached as static properties pointing at the corresponding Chakra parts.

### Convenience (`trigger=`) mode

```tsx
<Modal
  trigger={<Button>Open</Button>}
  size="md"
  onOpenChange={({ open }) => setOpen(open)}
>
  <Modal.Header>
    <Modal.Title>Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>Auto-wrapped in Backdrop + Positioner + Content.</Modal.Body>
  <Modal.Footer>
    <Modal.CloseTrigger asChild>
      <Button>Close</Button>
    </Modal.CloseTrigger>
  </Modal.Footer>
</Modal>
```

The wrapper auto-injects `<Modal.Backdrop>`, `<Modal.Positioner>`, and
`<Modal.Content>` around children. `Backdrop` is omitted when
`hideBackdrop` is `true`.

### Controlled

```tsx
const [open, setOpen] = useState(false);
<Modal
  open={open}
  onOpenChange={({ open }) => setOpen(open)}
  onClose={(event, reason) => console.log('closed by', reason)}
>
  {/* trigger or compositional tree */}
</Modal>;
```

### Props

```ts
import type { Dialog as ChakraDialog } from '@chakra-ui/react';
import type { ReactNode, RefObject } from 'react';

type CloseReason = 'escapeKeyDown' | 'backdropClick';

export interface ModalProps extends Omit<ChakraDialog.RootProps, 'children'> {
  /**
   * Callback fired when the component requests to be closed via an
   * Ark-originated event (Escape key, click outside). Close-button
   * clicks go through `onOpenChange` instead.
   */
  onClose?: (
    event: KeyboardEvent | PointerEvent | MouseEvent,
    reason: CloseReason
  ) => void;
  /** Fires on backdrop/outside click, before `onClose`. */
  onBackdropClick?: (event: PointerEvent | MouseEvent) => void;
  /** Fires on Escape, before `onClose`. */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;

  /**
   * If `true`, clicking the backdrop does NOT close the modal.
   * Default: `false` (Chakra standard).
   */
  disableBackdropClick?: boolean;
  /**
   * If `true`, Escape does NOT close the modal.
   * Default: `false` (Chakra standard).
   */
  disableEscapeKeyDown?: boolean;
  /**
   * If `true`, focus is not restored to the previously focused element
   * after the modal closes. Default: `false`.
   */
  disableRestoreFocus?: boolean;

  /** If `true`, the backdrop is not rendered. Default: `false`. */
  hideBackdrop?: boolean;
  /**
   * If `true`, the modal remains in the DOM after close (hidden).
   * Default: `false` (unmount on close).
   */
  keepInDOMAfterClose?: boolean;
  /** If `true`, focus is trapped inside the modal. Default: `true`. */
  trapFocus?: boolean;

  /** Props forwarded to `<Modal.Backdrop>`. */
  backdropProps?: ChakraDialog.BackdropProps;
  /** Props forwarded to `<Modal.Content>`. */
  contentProps?: ChakraDialog.ContentProps;

  /**
   * Convenience: element wrapped in `<ChakraDialog.Trigger asChild>`.
   * When set, the wrapper also auto-injects Backdrop + Positioner +
   * Content around `children`.
   */
  trigger?: ReactNode;

  children?: ReactNode;
}
```

### Mode precedence

- If `trigger` is provided → auto-inject Backdrop + Positioner + Content
  around children. `hideBackdrop` suppresses the Backdrop; `backdropProps`
  and `contentProps` are forwarded to the auto-injected slots.
- Otherwise → compositional; children render as direct children of
  `ChakraDialog.Root`. The caller is responsible for their own subtree —
  `hideBackdrop`, `backdropProps`, and `contentProps` are ignored in
  this mode (caller writes `<Modal.Backdrop {...props}>` themselves).

There is no `anchorRef` mode for Modal (it's centered, not anchored).

### Close-reason synthesis

Ark Dialog exposes `onEscapeKeyDown` and `onInteractOutside`. The
wrapper listens to both and calls `onClose(event, reason)`. Chakra
still handles actual state mutation via `onOpenChange`, so:

```tsx
<ChakraDialog.Root
  closeOnEscape={!disableEscapeKeyDown}
  closeOnInteractOutside={!disableBackdropClick}
  restoreFocus={!disableRestoreFocus}
  unmountOnExit={!keepInDOMAfterClose}
  trapFocus={trapFocus}
  onEscapeKeyDown={(event) => {
    onEscapeKeyDown?.(event);
    if (!disableEscapeKeyDown) onClose?.(event, 'escapeKeyDown');
  }}
  onInteractOutside={(event) => {
    onBackdropClick?.(event as PointerEvent);
    if (!disableBackdropClick)
      onClose?.(event as PointerEvent, 'backdropClick');
  }}
  {...rest}
>
```

`onClose` does NOT fire for `CloseTrigger`/`ActionTrigger` button clicks
— those go through `onOpenChange`. This matches Teleport's original
semantics: Teleport's `onClose` only fires for escape/backdrop.

## Recipe (slot styling)

```ts
import { defineSlotRecipe } from '@chakra-ui/react';
import { dialogAnatomy } from '@chakra-ui/react/anatomy';

export const modalSlotRecipe = defineSlotRecipe({
  className: 'teleport-modal',
  slots: dialogAnatomy.keys(),
  base: {
    backdrop: {
      bg: 'blackAlpha.600',
      zIndex: 'modal',
    },
    positioner: {
      zIndex: 'modal',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
    },
    content: {
      bg: 'levels.surface',
      color: 'text.main',
      borderRadius: 'md',
      boxShadow: 'lg',
      px: 8,
      pt: 6,
      pb: 8,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      maxH: 'calc(100% - 96px)',
      overflowY: 'auto',
      zIndex: 'modal',
      _open: {
        animationStyle: 'scale-fade-in',
        animationDuration: 'fast',
      },
      _closed: {
        animationStyle: 'scale-fade-out',
        animationDuration: 'fast',
      },
    },
    header: {
      minH: 8,
      mb: 3,
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    },
    title: {
      textStyle: 'xl',
      fontWeight: 'bold',
    },
    body: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      mb: 5,
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 2,
    },
    closeTrigger: {
      position: 'absolute',
      top: 3,
      insetEnd: 3,
    },
  },
});
```

### `invisible` backdrop

Teleport's `BackdropProps.invisible` (keep the backdrop element, but make
it transparent — still blocks clicks) maps to a boolean prop on the
backdrop slot via `backdropProps={{ bg: 'transparent' }}`. We do not
introduce a slot-recipe variant for this; the prop-level override is
clearer and matches how consumers express one-off styling. Consumers who
want no backdrop at all (clicks pass through) use `hideBackdrop`.

Register in `src/theme/slotRecipes.ts`:

```ts
export const slotRecipes = {
  blockquote: blockquoteSlotRecipe,
  list: listSlotRecipe,
  modal: modalSlotRecipe,
  popover: popoverSlotRecipe,
  table: tableSlotRecipe,
  tooltip: tooltipSlotRecipe,
};
```

## Stories

`src/storybook/stories/components/overlays/Modal.stories.tsx`:

1. **Default** — compositional, click-to-open, play fn asserts content
   appears in the portal.
2. **Convenience** — `trigger=` prop.
3. **Sizes** — every `size` variant in a row (`sm`, `md`, `lg`, `xl`,
   `cover`, `full`).
4. **Placements** — `top`, `center`, `bottom`.
5. **MotionPreset** — `slide-in-bottom`, `scale`, `none` alongside each
   other.
6. **HideBackdrop** — renders modal without a backdrop (popover-like
   use case).
7. **KeepInDOMAfterClose** — counter inside the modal; counter persists
   across open/close cycles.
8. **TrapFocus** — two modals: one with trap on (default), one with
   `trapFocus={false}` showing Tab can escape.
9. **DisableClose** — `disableBackdropClick` + `disableEscapeKeyDown`
   set; modal stays open through both attempts.
10. **CloseReason** — `onClose(event, reason)` logged to `args.onClose`
    (spy), play fn presses Escape and asserts the reason.

## Testing strategy

- `pnpm type-check` — type contract
- `pnpm test --project=storybook` — runs Default and CloseReason play
  functions at minimum (others are visual regression via Storybook)

## Risks

- **Default change from Teleport:** Teleport's `Dialog` defaulted to
  `disableBackdropClick=true` and `disableEscapeKeyDown=true`. Switching
  to Chakra defaults means migrating consumers who don't opt out will
  pick up backdrop/escape dismissal they previously didn't have. This
  is the right default (standard a11y), but consumers handling
  destructive actions should audit and explicitly pass
  `disableEscapeKeyDown` / `disableBackdropClick` as needed.
- **`onClose` reason granularity:** Ark's `InteractOutside` event can
  be a `PointerEvent` or `FocusEvent`. We widen `onClose`'s event type
  to the union used by Teleport (`KeyboardEvent | PointerEvent |
MouseEvent`). Consumers narrowing on `reason` will still work.

## Open questions

None remaining. Defaults confirmed by user on 2026-04-19. `modalCss` /
`dialogCss` dropped in favor of `contentProps.css`.
