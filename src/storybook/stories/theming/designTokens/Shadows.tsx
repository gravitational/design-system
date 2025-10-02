import { Box, Center, For, SimpleGrid, Stack } from '@chakra-ui/react';

import { system } from '../../../../themes/teleport';
import { Token } from './Token';

const keys = Object.keys(system._config.theme?.tokens?.shadows ?? {});

export function Shadows() {
  return (
    <Token mt="4">
      <SimpleGrid minChildWidth="240px" gap="4">
        <For each={keys}>
          {shadow => {
            const token = system.tokens.getByName(`shadow.${shadow}`);
            return (
              <Stack key={shadow} flex="1">
                <Center
                  boxShadow={shadow}
                  borderRadius="md"
                  width="full"
                  h="20"
                  bg="interactive.tonal.neutral.0"
                  color="text.slightlyMuted"
                  borderColor="interactive.tonal.neutral.1"
                  borderWidth="1px"
                />
                <Box fontSize="md" lineHeight="1" color="text.main">
                  {shadow}
                </Box>
                <Box as="pre" color="text.slightlyMuted" fontSize="md">
                  {token?.originalValue}
                </Box>
              </Stack>
            );
          }}
        </For>
      </SimpleGrid>
    </Token>
  );
}
