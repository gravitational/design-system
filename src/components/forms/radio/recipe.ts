import { defineSlotRecipe } from '@chakra-ui/react';
import { radioGroupAnatomy } from '@chakra-ui/react/anatomy';

export const radioGroupSlotRecipe = defineSlotRecipe({
  className: 'teleport-radio-group',
  slots: radioGroupAnatomy.keys(),
  base: {
    root: {
      display: 'inline-flex',
      gap: 2,
      _vertical: {
        flexDirection: 'column',
      },
      _horizontal: {
        flexDirection: 'row',
      },
    },
    label: {
      textStyle: 'body3',
      color: 'text.main',
      userSelect: 'none',
    },
    item: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      position: 'relative',
      cursor: 'pointer',
      _disabled: {
        cursor: 'not-allowed',
      },
    },
    itemControl: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      borderRadius: 'full',
      bg: 'transparent',
      borderStyle: 'solid',
      borderColor: 'text.muted',
      color: 'interactive.solid.primary.default',
      cursor: 'pointer',
      transitionProperty: 'border-color, background-color, box-shadow',
      transitionDuration: 'moderate',
      '& .dot': {
        width: '100%',
        height: '100%',
        borderRadius: 'full',
        bg: 'currentColor',
      },
      _hover: {
        bg: 'interactive.tonal.neutral.0',
        borderColor: 'text.slightlyMuted',
        boxShadow: 'xs',
        color: 'interactive.solid.primary.hover',
      },
      _focusVisible: {
        bg: 'interactive.tonal.neutral.0',
        borderColor: 'interactive.solid.primary.default',
        outline: '3px solid',
        outlineColor: 'interactive.solid.primary.default',
        outlineOffset: '-1px',
      },
      _active: {
        bg: 'interactive.tonal.neutral.1',
        borderColor: 'text.slightlyMuted',
        color: 'interactive.solid.primary.active',
      },
      _checked: {
        bg: 'transparent',
        borderColor: 'interactive.solid.primary.default',
        _hover: {
          bg: 'transparent',
          borderColor: 'interactive.solid.primary.hover',
        },
        _active: {
          bg: 'transparent',
          borderColor: 'interactive.solid.primary.active',
        },
        _focusVisible: {
          bg: 'transparent',
          borderColor: 'interactive.solid.primary.default',
        },
      },
      _disabled: {
        borderColor: 'text.disabled',
        color: 'text.disabled',
        cursor: 'not-allowed',
      },
    },
    itemText: {
      color: 'text.main',
      textStyle: 'body1',
      userSelect: 'none',
      _disabled: {
        color: 'text.disabled',
      },
    },
  },
  variants: {
    size: {
      sm: {
        itemControl: {
          width: '14px',
          height: '14px',
          borderWidth: '1px',
          '& .dot': {
            scale: '0.57',
          },
        },
        itemText: { textStyle: 'body2' },
      },
      md: {
        itemControl: {
          width: '18px',
          height: '18px',
          borderWidth: '1.5px',
          '& .dot': {
            scale: '0.56',
          },
        },
        itemText: { textStyle: 'body1' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
