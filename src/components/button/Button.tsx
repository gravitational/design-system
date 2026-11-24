import {
  Button as ChakraButton,
  type ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';
import {
  isValidElement,
  type ComponentProps,
  type MouseEvent,
  type ReactElement,
  type Ref,
  type RefAttributes,
} from 'react';

export type ButtonProps = ChakraButtonProps;

function isAnchorButton(props: ButtonProps) {
  if (props.as === 'a') return true;
  if (!props.asChild || !isValidElement(props.children)) return false;
  const child = props.children as ReactElement<{ href?: unknown }>;
  return child.type === 'a' || typeof child.props.href === 'string';
}

export function Button(props: ButtonProps) {
  if (!props.disabled || !isAnchorButton(props)) {
    return <ChakraButton {...props} />;
  }

  // `disabled` is not a real attribute on <a>. The recipe hides pointer
  // events; this also drops the link from the tab order and cancels navigation
  // if a click still arrives (keyboard or a scripted click).
  const { onClick, ...rest } = props;
  return (
    <ChakraButton
      {...rest}
      aria-disabled
      tabIndex={-1}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        onClick?.(event);
      }}
    />
  );
}

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
