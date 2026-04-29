import { Popover as ChakraPopover, Portal } from '@chakra-ui/react';
import {
  isValidElement,
  type ReactNode,
  type RefAttributes,
  type RefObject,
} from 'react';

export type PopoverPositioning = NonNullable<
  ChakraPopover.RootProps['positioning']
>;
export type PopoverPlacement = NonNullable<PopoverPositioning['placement']>;

export interface ComposedPopoverProps extends Omit<
  ChakraPopover.RootProps,
  'positioning' | 'children'
> {
  /**
   * Placement shortcut. Feeds `positioning.placement`. A user-supplied
   * `positioning.placement` wins on conflict.
   */
  placement?: PopoverPlacement;
  /**
   * Distance-from-anchor shortcut (px). Feeds `positioning.gutter`. A
   * user-supplied `positioning.gutter` wins on conflict.
   */
  gutter?: number;
  /** Full Chakra positioning config. Overrides flat shortcuts. */
  positioning?: PopoverPositioning;
  /** Render an arrow. */
  showArrow?: boolean;
  /** Render content in a Portal. Default `true`. */
  portalled?: boolean;
  /** Target container for the Portal. */
  portalRef?: RefObject<HTMLElement | null>;
  /**
   * Imperative anchor element. When set, no `<Popover.Trigger>` is
   * rendered; the popover positions itself against the ref.
   */
  anchorRef?: RefObject<HTMLElement | null>;
  /**
   * Convenience: element wrapped in `<Popover.Trigger asChild>`. Ignored
   * when `anchorRef` is provided.
   */
  trigger?: ReactNode;
  /** Forwarded to the auto-injected `<Popover.Content>`. */
  contentProps?: ChakraPopover.ContentProps;
  /** Popover body (auto-wrapped in `<Popover.Content>`). */
  children?: ReactNode;
}

export function ComposedPopover({
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
}: ComposedPopoverProps & RefAttributes<HTMLDivElement>) {
  const mergedPositioning = mergePositioning(
    placement,
    gutter,
    anchorRef,
    positioning
  );

  return (
    <ChakraPopover.Root
      positioning={mergedPositioning}
      portalled={portalled}
      {...rest}
    >
      {anchorRef === undefined && isValidElement(trigger) && (
        <ChakraPopover.Trigger asChild>{trigger}</ChakraPopover.Trigger>
      )}

      <Portal disabled={!portalled} container={portalRef}>
        <ChakraPopover.Positioner>
          <ChakraPopover.Content ref={ref} {...contentProps}>
            {showArrow && (
              <ChakraPopover.Arrow>
                <ChakraPopover.ArrowTip />
              </ChakraPopover.Arrow>
            )}

            {children}
          </ChakraPopover.Content>
        </ChakraPopover.Positioner>
      </Portal>
    </ChakraPopover.Root>
  );
}

function mergePositioning(
  placement: PopoverPlacement | undefined,
  gutter: number | undefined,
  anchorRef: RefObject<HTMLElement | null> | undefined,
  positioning: PopoverPositioning | undefined
): PopoverPositioning {
  return {
    ...(placement !== undefined && { placement }),
    ...(gutter !== undefined && { gutter }),
    ...(anchorRef && {
      getAnchorElement: () => anchorRef.current,
    }),
    ...positioning,
  };
}
