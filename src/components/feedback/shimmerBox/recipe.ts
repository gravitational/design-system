import { defineRecipe } from '@chakra-ui/react';

export const shimmerBoxRecipe = defineRecipe({
  className: 'teleport-shimmer-box',
  base: {
    position: 'relative',
    width: '100%',
    height: '100%',
    bg: 'interactive.tonal.neutral.0',
    borderRadius: 'sm',
    overflow: 'hidden',
    _after: {
      content: '""',
      position: 'absolute',
      inset: 0,
      bg: 'linear-gradient(90deg, transparent 25%, {colors.interactive.tonal.neutral.1} 50%, transparent 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer',
      animationDuration: 'slower',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
    },
  },
});
