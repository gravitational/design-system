import { Card as ChakraCard } from '@chakra-ui/react';
import type { ReactNode, RefAttributes } from 'react';

export interface ComposedCardProps extends Omit<
  ChakraCard.RootProps,
  'title' | 'content'
> {
  /** Optional title rendered in the card header. */
  title?: ReactNode;
  /** Optional content rendered in the card footer. */
  footer?: ReactNode;
}

export function ComposedCard({
  title,
  footer,
  children,
  ref,
  ...rest
}: ComposedCardProps & RefAttributes<HTMLDivElement>) {
  return (
    <ChakraCard.Root ref={ref} {...rest}>
      {title && (
        <ChakraCard.Header px={5} pt={5}>
          <ChakraCard.Title>{title}</ChakraCard.Title>
        </ChakraCard.Header>
      )}
      <ChakraCard.Body p={5}>{children}</ChakraCard.Body>
      {footer && (
        <ChakraCard.Footer px={5} pb={5} gap={2}>
          {footer}
        </ChakraCard.Footer>
      )}
    </ChakraCard.Root>
  );
}
