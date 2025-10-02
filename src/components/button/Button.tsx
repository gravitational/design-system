import {
  Button,
  type ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';
import type { ComponentPropsWithoutRef, Ref } from 'react';

export { Button };

export interface ButtonProps extends ChakraButtonProps {
  ref?: Ref<HTMLButtonElement>;
}

export function ButtonSecondary(props: Omit<ButtonProps, 'fill' | 'intent'>) {
  return <Button fill="filled" intent="neutral" {...props} />;
}

export function ButtonBorder(props: Omit<ButtonProps, 'fill' | 'intent'>) {
  return <Button fill="border" intent="neutral" {...props} />;
}

export function ButtonWarning(props: Omit<ButtonProps, 'fill' | 'intent'>) {
  return <Button fill="filled" intent="danger" {...props} />;
}

export function ButtonWarningBorder(
  props: Omit<ButtonProps, 'fill' | 'intent'>
) {
  return <Button fill="border" intent="danger" {...props} />;
}

export function ButtonText(props: Omit<ButtonProps, 'fill' | 'intent'>) {
  return <Button fill="minimal" intent="neutral" {...props} />;
}

export function ButtonLink(
  props: Omit<ButtonProps, 'fill' | 'intent'> & ComponentPropsWithoutRef<'a'>
) {
  return <Button as="a" fill="link" intent="neutral" {...props} />;
}
