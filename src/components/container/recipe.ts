import { defineRecipe } from '@chakra-ui/react';

export const containerRecipe = defineRecipe({
  className: 'teleport-container',
  base: {
    position: 'relative',
    maxWidth: '8xl',
    w: '100%',
    mx: 'auto',
    px: { base: '4', md: '6', lg: '8' },
  },
  variants: {
    /**
     * If `true`, center the content horizontally
     */
    centerContent: {
      true: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    /**
     * If `true`, the container will take the full width of its parent
     */
    fluid: {
      true: {
        maxWidth: 'full',
      },
    },
  },
});
