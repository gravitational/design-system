import {
  Container as ChakraContainer,
  type ContainerProps,
} from '@chakra-ui/react';

// Re-exporting the Container component from Chakra UI with the same props so that Storybook
// can generate the types correctly.
export function Container(props: ContainerProps) {
  return <ChakraContainer {...props} />;
}

export type { ContainerProps };
