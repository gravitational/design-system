import { type IconProps, type InputProps as ChakraInputProps } from '@chakra-ui/react';
import type { ComponentType, RefAttributes } from 'react';
export type InputSize = 'sm' | 'md' | 'lg';
export interface InputProps extends Omit<ChakraInputProps, 'size'> {
    size?: InputSize;
    /** Whether this input has an error. */
    hasError?: boolean;
    /** Optional icon to render on the left side of the input. */
    icon?: ComponentType<IconProps>;
}
export declare function Input({ icon: IconComponent, hasError, size, disabled, ...rest }: InputProps & RefAttributes<HTMLInputElement>): import("react/jsx-runtime").JSX.Element;
