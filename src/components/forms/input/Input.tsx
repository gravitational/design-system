import {
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
} from '@chakra-ui/react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

export interface InputProps
  extends ChakraInputProps,
    RefAttributes<HTMLInputElement> {}

export const Input: ForwardRefExoticComponent<InputProps> = ChakraInput;
