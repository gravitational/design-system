import { Box, For, HStack, Stack, Text } from '@chakra-ui/react';

import { system } from '../../../../themes/teleport';
import { Token } from './Token';

const { tokens, _config } = system;

const fonts = Object.keys(_config.theme?.tokens?.fonts ?? {});
const fontSizes = Object.keys(_config.theme?.tokens?.fontSizes ?? {});
const fontWeights = Object.keys(_config.theme?.tokens?.fontWeights ?? {});
const lineHeights = Object.keys(_config.theme?.tokens?.lineHeights ?? {});
const letterSpacings = Object.keys(_config.theme?.tokens?.letterSpacings ?? {});

export function Font() {
  return (
    <Token my="4">
      <Stack gap="8">
        <For each={fonts}>
          {font => {
            const token = tokens.getByName(`fonts.${font}`);
            return (
              <Stack key={font} flex="1">
                <Text fontSize="xl" fontFamily={font}>
                  Ag
                </Text>
                <Box>{font}</Box>
                <Box
                  fontFamily="mono"
                  whiteSpace="balance"
                  color="text.slightlyMuted"
                  fontSize="md"
                >
                  {token?.originalValue}
                </Box>
              </Stack>
            );
          }}
        </For>
      </Stack>
    </Token>
  );
}

export function FontSize() {
  return (
    <Token my="4">
      <Stack gap="4">
        {fontSizes.map(fontSize => {
          const token = tokens.getByName(`fontSizes.${fontSize}`);

          if (!token) {
            return null;
          }

          return (
            <Stack key={fontSize} direction="row" align="center">
              <Text width="4rem">{token.extensions.prop}</Text>
              <Text width="18rem" color="text.slightlyMuted">
                {token.value}
              </Text>
              <Text fontSize={token.value as string}>Ag</Text>
            </Stack>
          );
        })}
      </Stack>
    </Token>
  );
}

export function FontWeight() {
  return (
    <Token my="4">
      <Stack gap="4">
        {fontWeights.map(fontWeight => {
          const token = tokens.getByName(`fontWeights.${fontWeight}`);

          if (!token) {
            return null;
          }

          return (
            <Stack key={fontWeight} direction="row" align="center">
              <Text width="6rem">{token.extensions.prop}</Text>
              <Text width="6rem" color="text.slightlyMuted">
                {token.value}
              </Text>
              <Text fontWeight={token.value as string} fontSize="2xl">
                Ag
              </Text>
            </Stack>
          );
        })}
      </Stack>
    </Token>
  );
}

export function LineHeight() {
  return (
    <Token my="4">
      <Stack gap="8">
        {lineHeights.map(lineHeight => {
          const token = tokens.getByName(`lineHeights.${lineHeight}`);

          if (!token) {
            return null;
          }

          return (
            <Stack key={lineHeight}>
              <HStack color="text.slightlyMuted">
                <Text>
                  {token.extensions.prop} / {token.value}
                </Text>
              </HStack>
              <Text fontSize="2xl" lineHeight={token.value as string}>
                Naruto is a Japanese manga series written and illustrated by
                Masashi Kishimoto. It tells the story of Naruto Uzumaki, a young
                ninja who seeks recognition from his peers and dreams of
                becoming the Hokage, the leader of his village.
              </Text>
            </Stack>
          );
        })}
      </Stack>
    </Token>
  );
}

export function LetterSpacing() {
  return (
    <Token my="4">
      <Stack gap="4">
        {letterSpacings.map(letterSpacing => {
          const token = tokens.getByName(`letterSpacings.${letterSpacing}`);

          if (!token) {
            return null;
          }

          return (
            <Stack key={letterSpacing}>
              <Text color="text.slightlyMuted">
                {token.extensions.prop} / {token.value}
              </Text>
              <Text fontSize="2xl" letterSpacing={token.value as string}>
                Naruto Uzumaki
              </Text>
            </Stack>
          );
        })}
      </Stack>
    </Token>
  );
}
