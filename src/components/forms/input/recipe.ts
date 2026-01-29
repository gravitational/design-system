import { defineRecipe } from '@chakra-ui/react';

export const inputRecipe = defineRecipe({
  className: 'teleport-input',
  base: {
    bg: 'transparent',
    borderWidth: '1px',
    borderColor: 'interactive.tonal.neutral.2',
    focusVisibleRing: 'inside',
    focusRingColor: 'interactive.solid.primary.default',
    width: '100%',
    minWidth: '0',
    outline: '0',
    position: 'relative',
    appearance: 'none',
    textAlign: 'start',
    borderRadius: 'l2',
    _disabled: {
      layerStyle: 'disabled',
    },
    height: 'var(--input-height)',
    minW: 'var(--input-height)',
    '--focus-color': 'colors.colorPalette.focusRing',
    '--error-color': {
      _light: 'colors.red.600',
      _dark: 'colors.red.300',
    },
    _invalid: {
      focusRingColor: 'var(--error-color)',
      borderColor: 'var(--error-color)',
      _hover: {
        borderColor: 'var(--error-color)',
      },
    },
    _hover: {
      borderColor: 'text.muted',
    },
    _icon: {
      display: 'flex',
      alignItems: 'center',
      pos: 'absolute',
      top: 0,
      bottom: 0,
    },
  },
  variants: {
    /**
     * The size of the input.
     */
    size: {
      sm: {
        textStyle: 'sm',
        px: '2.5',
        '--input-height': 'sizes.9',
        _icon: {
          fontSize: '16px',
        },
      },
      md: {
        textStyle: 'md',
        px: '4',
        '--input-height': 'sizes.10',
        _icon: {
          fontSize: '18px',
        },
      },
      lg: {
        textStyle: 'md',
        px: '4',
        '--input-height': 'sizes.11',
        _icon: {
          fontSize: '20px',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
