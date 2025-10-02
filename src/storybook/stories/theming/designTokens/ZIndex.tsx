import { Flex, Stack, Text } from '@chakra-ui/react';

import { system } from '../../../../themes/teleport';
import { Token } from './Token';

const allZIndex = system.tokens.categoryMap.get('zIndex')?.values() ?? [];

export const defaultZIndex = Array.from(allZIndex).sort(
  (a, b) =>
    parseFloat(a.originalValue as string) -
    parseFloat(b.originalValue as string)
);

export function ZIndex() {
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
      </Flex>

      <Stack px="3" pt="2">
        {defaultZIndex.map(token => (
          <Flex key={token.name} py="1" fontSize="md">
            <Text width="100px" fontWeight="medium">
              {token.extensions.prop}
            </Text>
            <Text width="100px" color="text.slightlyMuted">
              {token.originalValue}
            </Text>
          </Flex>
        ))}
      </Stack>
    </Token>
  );
}
