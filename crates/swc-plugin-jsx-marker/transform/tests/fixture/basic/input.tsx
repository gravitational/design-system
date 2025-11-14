import { Box, chakra, HStack } from '@chakra-ui/react';

const StyledBox = chakra(Box, {
  base: {
    color: 'red',
  },
});

function MyComponent() {
  return (
    <HStack>
      <Box>Hello</Box>
      <StyledBox>World</StyledBox>
    </HStack>
  );
}
