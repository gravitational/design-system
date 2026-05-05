import { defineSlotRecipe } from '@chakra-ui/react';
import { checkboxAnatomy } from '@chakra-ui/react/anatomy';

export const checkboxSlotRecipe = defineSlotRecipe({
  className: 'teleport-checkbox',
  slots: checkboxAnatomy.keys(),
  base: {
    group: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    },
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      position: 'relative',
      lineHeight: 0,
      cursor: 'pointer',
      _disabled: {
        cursor: 'not-allowed',
      },
    },
    control: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      appearance: 'none',
      bg: 'transparent',
      borderWidth: '1.5px',
      borderStyle: 'solid',
      borderColor: 'text.muted',
      borderRadius: 'sm',
      color: 'text.primaryInverse',
      cursor: 'pointer',
      transitionProperty: 'border-color, background-color, box-shadow',
      transitionDuration: 'moderate',
      _hover: {
        bg: 'interactive.tonal.neutral.0',
        borderColor: 'text.slightlyMuted',
      },
      _focusVisible: {
        bg: 'interactive.tonal.neutral.0',
        borderColor: 'buttons.primary.default',
        borderWidth: '2px',
        outline: 'none',
      },
      _active: {
        bg: 'interactive.tonal.neutral.1',
        borderColor: 'text.slightlyMuted',
      },
      _checked: {
        bg: 'buttons.primary.default',
        borderColor: 'transparent',
        _hover: {
          bg: 'buttons.primary.hover',
          borderColor: 'transparent',
          boxShadow: 'xs',
        },
        _focusVisible: {
          bg: 'buttons.primary.default',
          borderColor: 'transparent',
          outline: '2px solid',
          outlineColor: 'buttons.primary.default',
          outlineOffset: '1px',
        },
        _active: {
          bg: 'buttons.primary.active',
          borderColor: 'transparent',
        },
      },
      _disabled: {
        bg: 'interactive.tonal.neutral.0',
        borderColor: 'transparent',
        cursor: 'not-allowed',
        color: 'text.main',
      },
    },
    label: {
      color: 'text.main',
      userSelect: 'none',
      _disabled: {
        color: 'text.disabled',
      },
    },
  },
  variants: {
    size: {
      sm: {
        control: {
          width: '14px',
          height: '14px',
          _icon: { width: '12px', height: '12px' },
        },
        label: { textStyle: 'body2' },
      },
      md: {
        control: {
          width: '18px',
          height: '18px',
          _icon: { width: '16px', height: '16px' },
        },
        label: { textStyle: 'body1' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
