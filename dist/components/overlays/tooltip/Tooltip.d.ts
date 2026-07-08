import { Tooltip as ChakraTooltip } from '@chakra-ui/react';
import { type ReactNode, type RefAttributes, type RefObject } from 'react';
export interface TooltipProps extends Omit<ChakraTooltip.RootProps, 'positioning'> {
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
export declare function Tooltip({ showArrow, children, disabled, portalled, content, contentProps, portalRef, placement, gutter, positioning, ref, ...rest }: TooltipProps & RefAttributes<HTMLDivElement>): string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<ReactNode> | Promise<string | number | bigint | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined;
export declare namespace Tooltip {
    type OpenChangeDetails = ChakraTooltip.OpenChangeDetails;
    type Positioning = NonNullable<ChakraTooltip.RootProps['positioning']>;
    type Placement = NonNullable<Positioning['placement']>;
}
