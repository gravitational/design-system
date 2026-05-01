import { Heading, type HeadingProps } from '@chakra-ui/react';

export { Heading } from '@chakra-ui/react';

export const H1 = (props: HeadingProps) => (
  <Heading as="h1" size="lg" {...props} />
);

export const H2 = (props: HeadingProps) => (
  <Heading as="h2" size="md" {...props} />
);

export const H3 = (props: HeadingProps) => (
  <Heading as="h3" size="sm" {...props} />
);

export const H4 = (props: HeadingProps) => (
  <Heading as="h4" size="xs" {...props} />
);
