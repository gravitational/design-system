import { defineSlotRecipe } from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/react/anatomy';

export const cardSlotRecipe = defineSlotRecipe({
  slots: cardAnatomy.keys(),
  className: 'teleport-card',
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      minWidth: 0,
      wordWrap: 'break-word',
      bg: 'levels.surface',
      borderRadius: 'md',
      boxShadow: 'md',
    },
    header: {
      display: 'flex',
      flexDirection: 'column',
    },
    body: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
    },
    title: {
      textStyle: 'h3',
    },
    description: {
      color: 'text.slightlyMuted',
    },
  },
});
