import { chakra, Text as ChakraText, type TextProps } from '@chakra-ui/react';

export { Text } from '@chakra-ui/react';

export const P1 = (props: TextProps) => (
  <ChakraText as="p" textStyle="body1" {...props} />
);

export const P2 = (props: TextProps) => (
  <ChakraText as="p" textStyle="body2" {...props} />
);

export const P3 = (props: TextProps) => (
  <ChakraText as="p" textStyle="body3" {...props} />
);

export const Caption = chakra('p', {
  base: { textStyle: 'caption' },
});

export const Overline = chakra('p', {
  base: { textStyle: 'overline' },
});
