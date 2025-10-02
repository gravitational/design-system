import { Box, Flex, Stack, Text } from '@chakra-ui/react';

import { system } from '../../../../themes/teleport';
import { Token } from './Token';

const allSpacing = system.tokens.categoryMap.get('spacing')?.values() ?? [];

export const defaultSpacings = Array.from(allSpacing)
  .filter(
    token =>
      token.extensions.category === 'spacing' && !token.extensions.negative
  )
  .sort(
    (a, b) => parseFloat(a.value as string) - parseFloat(b.value as string)
  );

export function Spacing() {
  return (
    <Token my="4">
      <Flex
        fontSize="md"
        fontWeight="medium"
        py="1"
        px="3"
        borderBottomColor="interactive.tonal.neutral.1"
        borderBottomWidth="1px"
      >
        <Text width="100px">Name</Text>
        <Text width="100px">Value</Text>
        <Text width="100px">Pixel</Text>
      </Flex>

      <Stack px="3" pt="2">
        {defaultSpacings.map(token => (
          <Flex key={token.name} py="1" fontSize="md">
            <Text width="100px" fontWeight="medium">
              {token.extensions.prop}
            </Text>
            <Text width="100px" color="text.slightlyMuted">
              {token.value}
            </Text>
            <Text width="100px" color="text.slightlyMuted">
              {token.extensions.pixelValue}
            </Text>
            <Box flex="1">
              <Box bg="brand" height="4" width={token.extensions.cssVar?.ref} />
            </Box>
          </Flex>
        ))}
      </Stack>
    </Token>
  );
}
