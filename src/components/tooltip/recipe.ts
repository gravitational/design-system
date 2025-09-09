import { defineSlotRecipe } from '@chakra-ui/react';
import { tooltipAnatomy } from '@chakra-ui/react/anatomy';

export const tooltipSlotRecipe = defineSlotRecipe({
  slots: tooltipAnatomy.keys(),
  className: 'teleport-tooltip',
  base: {
    content: {
      '--tooltip-bg': 'colors.tooltip.background',
      bg: 'var(--tooltip-bg)',
      color: 'text.primaryInverse',
      px: 3,
      py: 2,
      filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15))',
      borderRadius: 'md',
      textStyle: 'xs',
      maxW: 'xs',
      zIndex: 'tooltip',
      transformOrigin: 'var(--transform-origin)',
      _open: {
        animationStyle: 'scale-fade-in',
        animationDuration: 'fast',
      },
      _closed: {
        animationStyle: 'scale-fade-out',
        animationDuration: 'fast',
      },
    },
    arrow: {
      '--arrow-size': 'sizes.2',
      '--arrow-background': 'var(--tooltip-bg)',
    },
    arrowTip: {
      borderTopWidth: '1px',
      borderInlineStartWidth: '1px',
      borderColor: 'var(--tooltip-bg)',
    },
  },
});
