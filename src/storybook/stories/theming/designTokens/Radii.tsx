import { Box, For, SimpleGrid, Square, Stack } from '@chakra-ui/react';

import { system } from '../../../../themes/teleport';
import { Token } from './Token';

const keys = Object.keys(system._config.theme?.tokens?.radii ?? {});

export function Radii() {
  return (
    <Token mt="4">
      <SimpleGrid minChildWidth="120px" gap="4">
        <For each={keys}>
          {radius => {
            const token = system.tokens.getByName(`radii.${radius}`);
            return (
              <Stack key={radius} flex="1">
                <Square
                  borderRadius={radius}
                  size="20"
                  bg="interactive.tonal.neutral.0"
                  color="text.slightlyMuted"
                  borderColor="interactive.tonal.neutral.1"
                  borderWidth="1px"
                />
                <Box fontSize="md" lineHeight="1" color="text.main">
                  {radius}
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
