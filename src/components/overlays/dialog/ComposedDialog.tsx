import { Dialog as ChakraDialog, Portal } from '@chakra-ui/react';
import type { ReactNode, RefAttributes } from 'react';

export interface ComposedDialogProps extends Omit<
  ChakraDialog.RootProps,
  'children'
> {
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

export function ComposedDialog({
  hideBackdrop,
  backdropProps,
  contentProps,
  trigger,
  children,
  ref,
  ...rest
}: ComposedDialogProps & RefAttributes<HTMLDivElement>) {
  return (
    <ChakraDialog.Root {...rest}>
      {trigger !== undefined && (
        <ChakraDialog.Trigger asChild>{trigger}</ChakraDialog.Trigger>
      )}

      <Portal>
        {!hideBackdrop && <ChakraDialog.Backdrop {...backdropProps} />}

        <ChakraDialog.Positioner>
          <ChakraDialog.Content ref={ref} {...contentProps}>
            {children}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    </ChakraDialog.Root>
  );
}
