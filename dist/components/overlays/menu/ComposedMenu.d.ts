import { Menu as ChakraMenu } from '@chakra-ui/react';
import { type ReactNode, type RefAttributes, type RefObject } from 'react';
export type MenuPositioning = NonNullable<ChakraMenu.RootProps['positioning']>;
export type MenuPlacement = NonNullable<MenuPositioning['placement']>;
export interface ComposedMenuProps extends Omit<ChakraMenu.RootProps, 'positioning' | 'children'> {
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
export declare function ComposedMenu({ placement, gutter, positioning, portalled, portalRef, trigger, contentProps, children, defaultOpen, open: openProp, onOpenChange: onOpenChangeProp, ref, ...rest }: ComposedMenuProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
