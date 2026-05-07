import { defineRecipe } from '@chakra-ui/react';

export const iconButtonRecipe = defineRecipe({
  className: 'teleport-icon-button',
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
    border: 'none',
    outline: 'none',
    overflow: 'visible',
    background: 'transparent',
    color: 'inherit',
    cursor: 'pointer',
    transitionProperty: 'common',
    transitionDuration: 'slow',
    _disabled: {
      color: 'text.disabled',
      cursor: 'default',
    },
    '&:not(:disabled)': {
      _hover: { bg: 'interactive.tonal.neutral.1' },
      _focus: { bg: 'interactive.tonal.neutral.1' },
      _active: { bg: 'interactive.tonal.neutral.2' },
    },
  },
  variants: {
    size: {
      sm: { width: '24px', height: '24px', fontSize: '12px' },
      md: { width: '32px', height: '32px', fontSize: '16px' },
      lg: { width: '48px', height: '48px', fontSize: '24px' },
    },
    shape: {
      circle: { borderRadius: 'full' },
      square: { borderRadius: 'sm' },
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'circle',
  },
});
