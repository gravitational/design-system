import { defineSlotRecipe } from '@chakra-ui/react';
import { fieldAnatomy } from '@chakra-ui/react/anatomy';

export const fieldSlotRecipe = defineSlotRecipe({
  className: 'teleport-field',
  slots: fieldAnatomy.keys(),
  base: {
    requiredIndicator: {
      color: {
        _light: 'red.500',
        _dark: 'red.200',
      },
      lineHeight: '1',
    },
    root: {
      display: 'flex',
      width: '100%',
      position: 'relative',
      gap: '1.5',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'start',
      textStyle: 'sm',
      fontWeight: 'medium',
      gap: '1',
      userSelect: 'none',
      _disabled: {
        opacity: '0.5',
      },
    },
    errorText: {
      display: 'inline-flex',
      alignItems: 'center',
      fontWeight: 'medium',
      gap: '1',
      color: {
        _light: 'red.600',
        _dark: 'red.300',
      },
      fontSize: 'sm',
    },
    helperText: {
      color: 'text.muted',
      fontSize: 'sm',
    },
  },
  variants: {
    orientation: {
      vertical: {
        root: {
          flexDirection: 'column',
          alignItems: 'flex-start',
        },
      },
      horizontal: {
        root: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        label: {
          flex: '0 0 var(--field-label-width, 80px)',
        },
      },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});
