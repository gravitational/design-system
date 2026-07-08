import { Dialog as ChakraDialog } from '@chakra-ui/react';
import { type ReactNode, type RefAttributes } from 'react';
export interface ComposedDialogProps extends Omit<ChakraDialog.RootProps, 'children'> {
    /** If `true`, the backdrop is not rendered. */
    hideBackdrop?: boolean;
    /** Props forwarded to the auto-injected `<Dialog.Backdrop>`. */
    backdropProps?: ChakraDialog.BackdropProps;
    /** Props forwarded to the auto-injected `<Dialog.Content>`. */
    contentProps?: ChakraDialog.ContentProps;
    /** Convenience: element wrapped in `<Dialog.Trigger asChild>`. */
    trigger?: ReactNode;
    /** Dialog body (auto-wrapped in `<Dialog.Content>`). */
    children?: ReactNode;
}
export declare function ComposedDialog({ hideBackdrop, backdropProps, contentProps, trigger, children, ref, ...rest }: ComposedDialogProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
