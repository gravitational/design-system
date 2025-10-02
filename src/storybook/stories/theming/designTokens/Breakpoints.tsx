import { Box, HStack, Stack, Text } from '@chakra-ui/react';

import { system } from '../../../../themes/teleport';
import { Token } from './Token';

const breakpoints = system._config.theme?.breakpoints ?? {};
const allBreakpoints = Object.entries(breakpoints)
  .sort((a, b) => parseFloat(a[1]) - parseFloat(b[1]))
  .map(([key]) => key);

export function Breakpoints() {
  return (
    <Token my="4">
      <Stack gap="8">
        {allBreakpoints.map((key, index) => {
          const width = (index + 1) * 4;
          return (
            <HStack key={key}>
              <Box minWidth="200px">
                <Box
                  rounded="sm"
                  height="12"
                  borderColor="interactive.tonal.neutral.1"
                  borderInlineWidth="4px"
                  borderTopWidth="4px"
                  borderBottomWidth="12px"
                  width={`${width}rem`}
                />
              </Box>
              <Box minWidth="80px">
                <Text py="2" fontWeight="medium">
                  {key}
                </Text>
              </Box>
              <Text py="2" opacity="0.6">
                {`@media screen (min-width >= ${breakpoints[key]})`}
              </Text>
            </HStack>
          );
        })}
      </Stack>
    </Token>
  );
}
