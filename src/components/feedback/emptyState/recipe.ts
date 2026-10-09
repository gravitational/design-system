import { defineSlotRecipe } from '@chakra-ui/react';
import { emptyStateAnatomy } from '@chakra-ui/react/anatomy';

export const emptyStateSlotRecipe = defineSlotRecipe({
  slots: emptyStateAnatomy.keys(),
  className: 'teleport-empty-state',
  base: {
    root: {
      width: 'full',
      px: 4,
      py: 6,
      // Extra bottom padding moves the content slightly upward, which looks
      // more visually centered.
      pb: 8,
      maxWidth: 'xl',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 5,
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'text.disabled',
      _icon: { boxSize: '10' },
    },
    title: {
      textStyle: 'h2',
    },
    description: {
      textStyle: 'body2',
      color: 'text.slightlyMuted',
      textWrap: 'balance',
    },
  },
});
