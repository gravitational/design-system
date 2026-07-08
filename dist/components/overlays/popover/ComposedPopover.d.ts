import { Popover as ChakraPopover } from '@chakra-ui/react';
import { type ReactNode, type RefAttributes, type RefObject } from 'react';
export type PopoverPositioning = NonNullable<ChakraPopover.RootProps['positioning']>;
export type PopoverPlacement = NonNullable<PopoverPositioning['placement']>;
export interface ComposedPopoverProps extends Omit<ChakraPopover.RootProps, 'positioning' | 'children'> {
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
export declare function ComposedPopover({ placement, gutter, positioning, showArrow, portalled, portalRef, anchorRef, trigger, contentProps, children, ref, ...rest }: ComposedPopoverProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
