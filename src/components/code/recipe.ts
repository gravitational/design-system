import { defineRecipe } from '@chakra-ui/react';

export const codeRecipe = defineRecipe({
  className: 'teleport-code',
  base: {
    fontFamily: 'mono',
    alignItems: 'center',
    display: 'inline-flex',
    borderRadius: 'l2',
  },
  variants: {
    variant: {
      subtle: {
        bg: 'interactive.tonal.neutral.0',
      },
      outline: {
        bg: 'interactive.tonal.neutral.0',
        color: 'text.main',
        shadow: 'inset 0 0 0px 1px var(--shadow-color)',
        shadowColor: 'interactive.tonal.neutral.1',
      },
    },
    size: {
      xs: {
        textStyle: '2xs',
        px: '1',
        minH: '4',
      },
      sm: {
        fontSize: 'sm',
        lineHeight: '16px',
        px: '1',
        minH: '5',
      },
      md: {
        textStyle: 'sm',
        px: '2',
        minH: '6',
      },
      lg: {
        textStyle: 'sm',
        px: '2.5',
        minH: '7',
      },
    },
  },
  defaultVariants: {
    variant: 'subtle',
    size: 'sm',
  },
});
