import { Box, Flex, Stack, Text } from '@chakra-ui/react';

import { system } from '../../../../themes/teleport';
import { Token } from './Token';

const { tokens } = system;

const allSizes = tokens.categoryMap.get('sizes')?.values() ?? [];
export const defaultSizes = Array.from(allSizes);

const fractionalSizes = defaultSizes.filter(token => token.name.includes('/'));
const namedSizes = defaultSizes.filter(token =>
  /v(h|w)|min|max|fit|prose|full/.exec(token.name)
);
const breakpointSizes = defaultSizes.filter(token =>
  /breakpoint/.exec(token.name)
);
const largeSizes = defaultSizes.filter(
  token => /sm|xl|xs|lg|md/.exec(token.name) && !breakpointSizes.includes(token)
);

const tokenSizes = defaultSizes
  .filter(
    token =>
      !fractionalSizes.includes(token) &&
      !namedSizes.includes(token) &&
      !breakpointSizes.includes(token) &&
      !largeSizes.includes(token)
  )
  .sort(
    (a, b) =>
      parseInt(a.extensions.pixelValue ?? '0') -
      parseInt(b.extensions.pixelValue ?? '0')
  );

interface SizesProps {
  name: string;
  tokens: (typeof defaultSizes)[number][];
}

function Sizes({ name, tokens }: SizesProps) {
  return (
    <Token my={4}>
      <Flex
        fontSize="md"
        fontWeight="medium"
        py="1"
        px="3"
        borderBottomColor="interactive.tonal.neutral.1"
        borderBottomWidth="1px"
      >
        <Text width="160px">Name</Text>
        <Text width="100px">Value</Text>
        {name === 'tokenSizes' && <Text width="100px">Pixel</Text>}
      </Flex>

      <Stack px="3" pt="2">
        {tokens.map(token => (
          <Flex key={token.name} py="1" fontSize="md">
            <Text width="160px" fontWeight="medium">
              {token.extensions.prop}
            </Text>
            <Text width="100px" color="text.slightlyMuted">
              {token.value}
            </Text>
            {name === 'tokenSizes' && (
              <Text width="100px" color="text.slightlyMuted">
                {token.extensions.pixelValue}
              </Text>
            )}
            {name === 'tokenSizes' && (
              <Box
                bg="brand"
                height="4"
                width={`min(${token.originalValue}, 60%)`}
              />
            )}
          </Flex>
        ))}
      </Stack>
    </Token>
  );
}

export function TokenSizes() {
  return <Sizes name="tokenSizes" tokens={tokenSizes} />;
}

export function NamedSizes() {
  return <Sizes name="namedSizes" tokens={namedSizes} />;
}

export function FractionalSizes() {
  return <Sizes name="fractionalSizes" tokens={fractionalSizes} />;
}

export function BreakpointSizes() {
  return <Sizes name="breakpointSizes" tokens={breakpointSizes} />;
}

export function LargeSizes() {
  return <Sizes name="largeSizes" tokens={largeSizes} />;
}
