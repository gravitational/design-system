import { Box } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

const meta = {
  component: Box,
} satisfies Meta<typeof Box>;

export default meta;

export function ExampleLonghand() {
  return (
    <Box
      padding={4}
      margin={4}
      color="text.primaryInverse"
      backgroundColor="brand"
      borderRadius="md"
    >
      This is a Box component
    </Box>
  );
}

ExampleLonghand.tags = ['!dev'];

export function ExampleShorthand() {
  return (
    <Box p={4} m={4} color="text.primaryInverse" bg="brand" borderRadius="md">
      This is a Box component
    </Box>
  );
}

ExampleShorthand.tags = ['!dev'];

export function ExamplePseudo() {
  return (
    <Box
      p={4}
      m={4}
      color="text.primaryInverse"
      bg="brand"
      borderRadius="md"
      _hover={{ bg: 'green.200' }}
    >
      This is a Box component
    </Box>
  );
}

ExamplePseudo.tags = ['!dev'];

export function BorderProp() {
  return (
    <Box p={4} m={4} border="1px solid {colors.brand}" borderRadius="md">
      This is a Box component
    </Box>
  );
}

BorderProp.tags = ['!dev'];

export function BorderWidthColorProps() {
  return (
    <Box p={4} m={4} borderWidth="1px" borderColor="brand" borderRadius="md">
      This is a Box component
    </Box>
  );
}

BorderWidthColorProps.tags = ['!dev'];

export function AsProp() {
  return (
    <Box as="section" bg="brand" borderRadius="md" p={4} m={4}>
      This is a box, as a {'<section />'} element
    </Box>
  );
}

AsProp.tags = ['!dev'];
