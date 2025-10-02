import { Box, Center, SimpleGrid, Stack, Text, VStack } from '@chakra-ui/react';

import { system } from '../../../../themes/teleport';
import { Token } from './Token';

const allKeyframes = Object.keys(system._config.theme?.keyframes ?? {}).filter(
  keyframe => !/expand|collapse|bg-|position|circular/.exec(keyframe)
);

export function Animations() {
  return (
    <Token mt="4">
      <SimpleGrid minChildWidth="160px" gap="10" fontSize="md">
        {allKeyframes.map(animationName => {
          return (
            <Stack key={animationName}>
              <Box
                boxSize="12"
                bg="brand"
                animation={`${animationName} 1s ease-in-out infinite alternate`}
              />
              <Text fontWeight="medium">{animationName}</Text>
            </Stack>
          );
        })}
      </SimpleGrid>
    </Token>
  );
}

const allDurations = Array.from(
  (system.tokens.categoryMap.get('durations')?.entries() ?? []) as [
    string,
    { value: string },
  ][]
)
  .sort(([, a], [, b]) => parseFloat(b.value) - parseFloat(a.value))
  .map(([key, token]) => ({ name: key, value: token.value }));

export function Durations() {
  return (
    <Token mt="4">
      <SimpleGrid minChildWidth="160px" gap="20" fontSize="md">
        {allDurations.map(duration => {
          return (
            <VStack key={duration.name}>
              <Center h="20">
                <Box
                  bg="brand"
                  height="1"
                  width="20"
                  animationName="spin"
                  animationDuration={duration.name}
                  animationTimingFunction="ease-in-out"
                  animationIterationCount="infinite"
                  animationDirection="alternate"
                />
              </Center>
              <Text fontWeight="medium">
                {duration.name} ({duration.value})
              </Text>
            </VStack>
          );
        })}
      </SimpleGrid>
    </Token>
  );
}
