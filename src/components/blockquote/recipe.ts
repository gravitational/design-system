import { defineSlotRecipe } from '@chakra-ui/react';
import { blockquoteAnatomy } from '@chakra-ui/react/anatomy';

export const blockquoteSlotRecipe = defineSlotRecipe({
  className: 'teleport-blockquote',
  slots: blockquoteAnatomy.keys(),
  base: {
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
    },
    caption: {
      textStyle: 'sm',
      color: 'text.slightlyMuted',
    },
    icon: {
      boxSize: '5',
    },
  },

  variants: {
    justify: {
      start: {
        root: {
          alignItems: 'flex-start',
          textAlign: 'start',
        },
      },
      center: {
        root: {
          alignItems: 'center',
          textAlign: 'center',
        },
      },
      end: {
        root: {
          alignItems: 'flex-end',
          textAlign: 'end',
        },
      },
    },

    variant: {
      subtle: {
        root: {
          color: 'text.slightlyMuted',
          paddingX: '5',
          borderStartWidth: '4px',
          borderStartColor: 'interactive.tonal.neutral.2',
        },
        icon: {
          color: 'colorPalette.fg',
        },
      },
    },
  },

  defaultVariants: {
    variant: 'subtle',
    justify: 'start',
  },
});
