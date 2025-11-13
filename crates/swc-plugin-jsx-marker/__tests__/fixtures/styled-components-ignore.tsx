import { Box, chakra } from '@chakra-ui/react';
// @ts-expect-error – styled-components is not installed
import styled from 'styled-components';

// This should NOT get data attribute (styled from styled-components)
const StyledComponentsButton = styled.button`
  color: blue;
`;

// This SHOULD get data attribute (styled from @chakra-ui/react)
const ChakraStyledBox = chakra(Box, { base: { color: 'red' } });

function MyComponent() {
  return (
    <div>
      {/* Should NOT have data-uic attribute */}
      <StyledComponentsButton>Styled Components Button</StyledComponentsButton>

      {/* SHOULD have data-uic attribute (regular import from configured library) */}
      <Box>Regular Box</Box>

      {/* SHOULD have data-uic attribute (styled from configured library) */}
      <ChakraStyledBox>Chakra Styled Box</ChakraStyledBox>
    </div>
  );
}
