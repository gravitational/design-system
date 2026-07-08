import { type CloseButtonProps as ChakraCloseButtonProps } from '@chakra-ui/react';
export type CloseButtonProps = Omit<ChakraCloseButtonProps, 'block' | 'intent' | 'compact' | 'inputAlignment' | 'loadingText' | 'spinnerPlacement'>;
export declare function CloseButton({ children, ...rest }: CloseButtonProps): import("react/jsx-runtime").JSX.Element;
