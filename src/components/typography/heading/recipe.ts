import { defineRecipe } from '@chakra-ui/react';

export const headingRecipe = defineRecipe({
  className: 'teleport-heading',
  base: {
    fontFamily: 'heading',
    fontWeight: 'bold',
  },
  variants: {
    size: {
      xs: {
        textStyle: 'subtitle2',
      },
      sm: {
        textStyle: 'subtitle1',
      },
      md: {
        textStyle: 'h4',
      },
      lg: {
        textStyle: 'h3',
      },
      xl: {
        textStyle: 'h2',
      },
      '2xl': {
        textStyle: 'h1',
      },
      '3xl': {
        fontSize: '32px',
        lineHeight: '40px',
        fontWeight: 'medium',
      },
    },
  },
  defaultVariants: {
    size: 'xl',
  },
});
