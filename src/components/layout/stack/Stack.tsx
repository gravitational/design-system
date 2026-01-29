import { Stack as ChakraStack, type StackProps } from '@chakra-ui/react';
import type { RefAttributes } from 'react';

export {
  type StackProps,
  StackSeparator,
  HStack,
  VStack,
} from '@chakra-ui/react';

export function Stack(props: StackProps & RefAttributes<HTMLDivElement>) {
  return <ChakraStack {...props} />;
}
