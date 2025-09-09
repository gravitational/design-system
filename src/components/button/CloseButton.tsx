import {
  IconButton,
  type CloseButtonProps as ChakraCloseButtonProps,
} from '@chakra-ui/react';

import { XIcon } from '../../icons';

export type CloseButtonProps = Omit<
  ChakraCloseButtonProps,
  | 'block'
  | 'intent'
  | 'compact'
  | 'inputAlignment'
  | 'loadingText'
  | 'spinnerPlacement'
>;

export function CloseButton({ children, ...rest }: CloseButtonProps) {
  return (
    <IconButton aria-label="Close" fill="minimal" intent="neutral" {...rest}>
      {children ?? <XIcon />}
    </IconButton>
  );
}
