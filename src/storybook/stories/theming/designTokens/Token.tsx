import { Box, type BoxProps } from '@chakra-ui/react';
import type { ReactNode } from 'react';

interface TokenProps extends BoxProps {
  action?: ReactNode;
}

export function Token({ action, children, title, ...rest }: TokenProps) {
  return (
    <Box
      bg="bg"
      rounded="md"
      borderWidth="0.5px"
      borderColor="interactive.tonal.neutral.1"
      {...rest}
    >
      <Box p="6" pb="0">
        {title && (
          <Box fontWeight="medium" fontSize="lg" as="h3" id={title}>
            {title}
          </Box>
        )}
        {action}
      </Box>
      <Box p="6">{children}</Box>
    </Box>
  );
}
