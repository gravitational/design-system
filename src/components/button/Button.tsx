import { Button, type ButtonProps } from '@chakra-ui/react';
import type { ComponentPropsWithoutRef } from 'react';

export { Button, type ButtonProps };

export function ButtonSecondary(props: ButtonProps) {
  return <Button fill="filled" intent="neutral" {...props} />;
}

export function ButtonBorder(props: ButtonProps) {
  return <Button fill="border" intent="neutral" {...props} />;
}

export function ButtonWarning(props: ButtonProps) {
  return <Button fill="filled" intent="danger" {...props} />;
}

export function ButtonWarningBorder(props: ButtonProps) {
  return <Button fill="border" intent="danger" {...props} />;
}

export function ButtonText(props: ButtonProps) {
  return <Button fill="minimal" intent="neutral" {...props} />;
}

export function ButtonLink(props: ButtonProps & ComponentPropsWithoutRef<'a'>) {
  return <Button as="a" fill="link" intent="neutral" {...props} />;
}
