import { Menu as ChakraMenu, Portal } from '@chakra-ui/react';
import type { ReactNode, RefAttributes, RefObject } from 'react';

export type MenuPositioning = NonNullable<ChakraMenu.RootProps['positioning']>;
export type MenuPlacement = NonNullable<MenuPositioning['placement']>;

export interface ComposedMenuProps extends Omit<
  ChakraMenu.RootProps,
  'positioning' | 'children'
> {
  /** @default 'bottom-start' */
  placement?: MenuPlacement;
  /** Distance from anchor in px. */
  gutter?: number;
  /** Full positioning config. Overrides `placement` and `gutter`. */
  positioning?: MenuPositioning;
  /** Render content in a Portal. Default `true`. */
  portalled?: boolean;
  /** Target container for the Portal. */
  portalRef?: RefObject<HTMLElement | null>;
  /**
   * Convenience: element wrapped in `<Menu.Trigger asChild>`. Typically a
   * Button.
   */
  trigger?: ReactNode;
  /** Forwarded to the auto-injected `<Menu.Content>`. */
  contentProps?: ChakraMenu.ContentProps;
  /** Menu items (auto-wrapped in `<Menu.Content>`). */
  children?: ReactNode;
}

/**
 * Displays a list of actions or options anchored to a trigger element.
 * Supports nested submenus, keyboard navigation, checkbox/radio items, and hover-to-open.
 */
export function ComposedMenu({
  placement = 'bottom-start',
  gutter,
  positioning,
  portalled = true,
  portalRef,
  trigger,
  contentProps,
  children,
  defaultOpen,
  open: openProp,
  onOpenChange: onOpenChangeProp,
  ref,
  ...rest
}: ComposedMenuProps & RefAttributes<HTMLDivElement>) {
  const mergedPositioning = mergePositioning(placement, gutter, positioning);
  const rootProps = mergeRootProps({ openProp, defaultOpen, onOpenChangeProp });

  return (
    <ChakraMenu.Root positioning={mergedPositioning} {...rootProps} {...rest}>
      {trigger !== undefined && (
        <ChakraMenu.Trigger asChild>{trigger}</ChakraMenu.Trigger>
      )}

      <Portal disabled={!portalled} container={portalRef}>
        <ChakraMenu.Positioner>
          <ChakraMenu.Content ref={ref} {...contentProps}>
            {children}
          </ChakraMenu.Content>
        </ChakraMenu.Positioner>
      </Portal>
    </ChakraMenu.Root>
  );
}

const mergeRootProps = ({
  defaultOpen,
  openProp: open,
  onOpenChangeProp: onOpenChange,
}: {
  defaultOpen?: boolean;
  openProp?: boolean;
  onOpenChangeProp?: React.ComponentProps<typeof ComposedMenu>['onOpenChange'];
}) => ({
  ...(defaultOpen !== undefined && { defaultOpen }),
  ...(open !== undefined && { open }),
  ...(onOpenChange !== undefined && { onOpenChange }),
});

const mergePositioning = (
  placement: MenuPlacement | undefined,
  gutter: number | undefined,
  positioning: MenuPositioning | undefined
): MenuPositioning => ({
  ...(placement !== undefined && { placement }),
  ...(gutter !== undefined && { gutter }),
  ...positioning,
});
