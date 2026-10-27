import { EmptyState as ChakraEmptyState, VStack } from '@chakra-ui/react';
import type { ComponentType, ReactNode, RefAttributes } from 'react';

import type { IconProps } from '../../../icons';

export interface ComposedEmptyStateProps extends ChakraEmptyState.RootProps {
  /** The title text of the empty state. */
  title: string;
  /** Additional description text displayed below the title. */
  description?: ReactNode;
  /** Optional icon. The `fill` variant usually looks better. */
  icon?: ComponentType<IconProps>;
}

/**
 * Displays a placeholder when there is no content to show.
 */
export function ComposedEmptyState({
  title,
  description,
  icon: Icon,
  children,
  ref,
  ...rest
}: ComposedEmptyStateProps & RefAttributes<HTMLDivElement>) {
  return (
    <ChakraEmptyState.Root ref={ref} {...rest}>
      <ChakraEmptyState.Content>
        {Icon && (
          <ChakraEmptyState.Indicator>
            <Icon />
          </ChakraEmptyState.Indicator>
        )}
        {description ? (
          <VStack gap={1}>
            <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
            <ChakraEmptyState.Description>
              {description}
            </ChakraEmptyState.Description>
          </VStack>
        ) : (
          <ChakraEmptyState.Title>{title}</ChakraEmptyState.Title>
        )}
        {children}
      </ChakraEmptyState.Content>
    </ChakraEmptyState.Root>
  );
}
