import { Alert as ChakraAlert, type SlotRecipeProps } from '@chakra-ui/react';
import type { ComponentType, ReactNode, RefAttributes } from 'react';
import { type IconProps } from '../../../icons';
export type AlertKind = Extract<SlotRecipeProps<'alert'>['kind'], string>;
export interface ComposedAlertProps extends Omit<ChakraAlert.RootProps, 'title' | 'content'> {
    /** The title text of the alert. */
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
 * Displays an in-page notice to communicate a message, error, or status.
 */
export declare function ComposedAlert({ kind, title, description, icon: Icon, isLoading, isClosable, onClose, children, ref, ...rest }: ComposedAlertProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
