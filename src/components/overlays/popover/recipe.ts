import { defineSlotRecipe } from '@chakra-ui/react';
import { popoverAnatomy } from '@chakra-ui/react/anatomy';

export const popoverSlotRecipe = defineSlotRecipe({
  className: 'teleport-popover',
  slots: popoverAnatomy.keys(),
  base: {
    content: {
      '--popover-bg': 'colors.levels.elevated',
      '--popover-z-index': 'zIndex.popover',
      position: 'relative',
      bg: 'var(--popover-bg)',
      color: 'text.main',
      boxShadow: 'lg',
      borderRadius: 'sm',
      minW: '4',
      zIndex: 'calc(var(--popover-z-index) + var(--layer-index, 0))',
      outline: 'none',
      transformOrigin: 'var(--transform-origin)',
    },
    arrow: {
      '--arrow-size': 'sizes.4',
      '--arrow-background': 'var(--popover-bg)',
    },
    header: {
      px: 4,
      pt: 3,
      pb: 2,
      fontWeight: 'bold',
    },
    body: {
      px: 4,
      py: 2,
    },
    footer: {
      px: 4,
      pt: 2,
      pb: 3,
    },
    closeTrigger: {
      position: 'absolute',
      top: 3,
      insetEnd: 3,
    },
  },
});
