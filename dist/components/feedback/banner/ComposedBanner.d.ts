import { type SlotRecipeProps } from '@chakra-ui/react';
import type { ComponentType, ReactNode, RefAttributes } from 'react';
import { type IconProps } from '../../../icons';
import { type BannerRootProps } from './banner';
export type BannerKind = Extract<SlotRecipeProps<'banner'>['kind'], string>;
export interface ComposedBannerProps extends Omit<BannerRootProps, 'title' | 'content'> {
    /** The title text of the banner. */
    title?: ReactNode;
    /** Additional description text displayed below the title. */
    description?: ReactNode;
    /** Optional custom icon. */
    icon?: ComponentType<IconProps>;
    /** If `true`, replaces the icon with a loading spinner. */
    isLoading?: boolean;
    /** If `true`, displays a close button. */
    isClosable?: boolean;
    /** Called when the close button is clicked. */
    onClose?: () => void;
}
/**
 * Displays a banner at the top of the page.
 */
export declare function ComposedBanner({ kind, title, description, icon: Icon, isLoading, isClosable, onClose, children, ref, ...rest }: ComposedBannerProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
