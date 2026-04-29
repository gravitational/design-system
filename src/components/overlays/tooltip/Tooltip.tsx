import { Portal, Tooltip as ChakraTooltip } from '@chakra-ui/react';
import { type ReactNode, type RefAttributes, type RefObject } from 'react';

export interface TooltipProps extends Omit<
  ChakraTooltip.RootProps,
  'positioning'
> {
  /**
   * Placement shortcut. Feeds `positioning.placement`. A user-supplied
   * `positioning.placement` wins on conflict.
   */
  placement?: Tooltip.Placement;
  /** Distance-from-anchor shortcut (px). Feeds `positioning.gutter`. */
  gutter?: number;
  /** Full Chakra positioning config. Overrides flat shortcuts. */
  positioning?: Tooltip.Positioning;
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: RefObject<HTMLElement | null>;
  content: ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
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

export namespace Tooltip {
  export type OpenChangeDetails = ChakraTooltip.OpenChangeDetails;
  export type Positioning = NonNullable<ChakraTooltip.RootProps['positioning']>;
  export type Placement = NonNullable<Positioning['placement']>;
}

function mergePositioning(
  placement: Tooltip.Placement | undefined,
  gutter: number | undefined,
  positioning: Tooltip.Positioning | undefined
): Tooltip.Positioning | undefined {
  if (placement === undefined && gutter === undefined && !positioning) {
    return undefined;
  }

  return {
    ...(placement !== undefined && { placement }),
    ...(gutter !== undefined && { gutter }),
    ...positioning,
  };
}
