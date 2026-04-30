import { defineRecipe } from '@chakra-ui/react';

export const headingRecipe = defineRecipe({
  className: 'teleport-heading',
  variants: {
    /**
     * The size of the heading.
     */
    size: {
      xs: {
        textStyle: 'h4',
      },
      sm: {
        textStyle: 'h3',
      },
      md: {
        textStyle: 'h2',
      },
      lg: {
        textStyle: 'h1',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
