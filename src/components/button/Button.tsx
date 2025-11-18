import {
  Button,
  type ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';
import type { ComponentProps, Ref, RefAttributes } from 'react';

export { Button };

export type ButtonProps = ChakraButtonProps;

export function ButtonSecondary(
  props: Omit<ButtonProps, 'fill' | 'intent'> & RefAttributes<HTMLButtonElement>
) {
  return <Button fill="filled" intent="neutral" {...props} />;
}

export function ButtonBorder(
  props: Omit<ButtonProps, 'fill' | 'intent'> & RefAttributes<HTMLButtonElement>
) {
  return <Button fill="border" intent="neutral" {...props} />;
}

export function ButtonWarning(
  props: Omit<ButtonProps, 'fill' | 'intent'> & RefAttributes<HTMLButtonElement>
) {
  return <Button fill="filled" intent="danger" {...props} />;
}

export function ButtonWarningBorder(
  props: Omit<ButtonProps, 'fill' | 'intent'> & RefAttributes<HTMLButtonElement>
) {
  return <Button fill="border" intent="danger" {...props} />;
}

export function ButtonText(
  props: Omit<ButtonProps, 'fill' | 'intent'> & RefAttributes<HTMLButtonElement>
) {
  return <Button fill="minimal" intent="neutral" {...props} />;
}

export function ButtonLink({
  ref,
  ...props
}: Omit<ButtonProps, 'fill' | 'intent'> & ComponentProps<'a'>) {
  return (
    <Button
      as="a"
      fill="link"
      intent="neutral"
      ref={ref as Ref<HTMLButtonElement>}
      {...props}
    />
  );
}
