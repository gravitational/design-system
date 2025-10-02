import { Box, chakra, Grid, VStack } from '@chakra-ui/react';
import type { PropsWithChildren } from 'react';

import { CopyableText } from '../theming/designTokens/ColorTokens';

export function IconGallery({ children }: PropsWithChildren) {
  return (
    <Grid gap={6} gridTemplateColumns="repeat(auto-fit, minmax(120px, 1fr))">
      {children}
    </Grid>
  );
}

interface IconItemProps {
  name: string;
}

const Value = chakra('div', {
  base: {
    border: '1px solid {colors.interactive.tonal.neutral.2}',
    fontFamily: 'mono',
    fontSize: '11px',
    display: 'inline-flex',
    alignItems: 'center',
    color: 'text.main',
    lineHeight: 1,
    py: '6px',
    cursor: 'pointer',
    px: 2,
    borderRadius: 'md',
    _hover: {
      bg: 'interactive.tonal.neutral.1',
    },
  },
});

export function IconItem({ name, children }: PropsWithChildren<IconItemProps>) {
  return (
    <VStack gap={2} p={4}>
      <Box fontSize="xl">{children}</Box>

      <CopyableText value={name}>
        <Value>{name}</Value>
      </CopyableText>
    </VStack>
  );
}
