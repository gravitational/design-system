import { Box, chakra, HStack } from '@chakra-ui/react';
const StyledBox = chakra(Box, {
    base: {
        color: 'red'
    }
});
function MyComponent() {
    return <HStack data-uic="MyComponent-HStack">
      <Box data-uic="MyComponent-Box">Hello</Box>
      <StyledBox data-uic="MyComponent-StyledBox-Box">World</StyledBox>
    </HStack>;
}
