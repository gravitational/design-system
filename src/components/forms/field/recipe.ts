import { defineSlotRecipe } from '@chakra-ui/react';
import { fieldAnatomy } from '@chakra-ui/react/anatomy';

export const fieldSlotRecipe = defineSlotRecipe({
  className: 'teleport-field',
  slots: fieldAnatomy.keys(),
  base: {
    root: {
      display: 'flex',
      width: '100%',
      position: 'relative',
      gap: 1,
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      textAlign: 'start',
      textStyle: 'body3',
      color: 'text.main',
      gap: 0,
      userSelect: 'none',
      _invalid: {
        color: 'interactive.solid.danger.default',
      },
      _disabled: {
        opacity: '0.5',
      },
    },
    requiredIndicator: {
      color: 'interactive.solid.danger.default',
      lineHeight: '1',
      marginStart: 1,
    },
    errorText: {
      display: 'inline-flex',
      alignItems: 'center',
      textStyle: 'body3',
      color: 'interactive.solid.danger.default',
    },
    helperText: {
      textStyle: 'body3',
      color: 'text.slightlyMuted',
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
