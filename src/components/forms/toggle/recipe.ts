import { defineSlotRecipe } from '@chakra-ui/react';
import { switchAnatomy } from '@chakra-ui/react/anatomy';

export const toggleSlotRecipe = defineSlotRecipe({
  className: 'teleport-toggle',
  slots: switchAnatomy.keys(),
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 2,
      position: 'relative',
      cursor: 'pointer',
      _disabled: {
        cursor: 'default',
      },
    },
    label: {
      textStyle: 'body2',
      color: 'text.main',
      userSelect: 'none',
      _disabled: {
        color: 'text.disabled',
      },
    },
    control: {
      display: 'inline-flex',
      flexShrink: 0,
      position: 'relative',
      borderRadius: '10px',
      bg: 'buttons.secondary.default',
      transitionProperty: 'background-color',
      transitionDuration: '150ms',
      transitionTimingFunction: 'ease-in-out',
      width: 'var(--toggle-track-width)',
      height: 'var(--toggle-track-height)',
      _hover: {
        bg: 'buttons.secondary.hover',
      },
      _active: {
        bg: 'buttons.secondary.active',
      },
      _checked: {
        bg: 'success.main',
        _hover: {
          bg: 'success.hover',
        },
        _active: {
          bg: 'success.active',
        },
      },
      _focusVisible: {
        outline: '1px solid',
        outlineColor: 'interactive.solid.primary.default',
        outlineOffset: '1px',
      },
      _disabled: {
        bg: 'interactive.tonal.neutral.0',
        cursor: 'default',
        _hover: {
          bg: 'interactive.tonal.neutral.0',
        },
        _checked: {
          bg: 'interactive.tonal.success.2',
        },
      },
    },
    thumb: {
      position: 'absolute',
      top: '50%',
      borderRadius: 'full',
      bg: 'white',
      boxShadow: 'xs',
      transitionProperty: 'transform',
      transitionDuration: '50ms',
      transitionTimingFunction: 'ease-in',
      width: 'var(--toggle-thumb-size)',
      height: 'var(--toggle-thumb-size)',
      transform: 'translate(var(--toggle-thumb-offset), -50%)',
      _checked: {
        transform: 'translate(var(--toggle-thumb-translate), -50%)',
      },
      _disabled: {
        opacity: '0.36',
        boxShadow: 'none',
      },
    },
  },
  variants: {
    size: {
      sm: {
        root: {
          '--toggle-track-width': '32px',
          '--toggle-track-height': '16px',
          '--toggle-thumb-size': '12px',
          '--toggle-thumb-offset': '2px',
          '--toggle-thumb-translate': '18px',
        },
      },
      lg: {
        root: {
          '--toggle-track-width': '40px',
          '--toggle-track-height': '20px',
          '--toggle-thumb-size': '14px',
          '--toggle-thumb-offset': '3px',
          '--toggle-thumb-translate': '23px',
        },
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});
