import { defineSlotRecipe } from '@chakra-ui/react';
import { alertAnatomy } from '@chakra-ui/react/anatomy';

export const alertSlotRecipe = defineSlotRecipe({
  slots: alertAnatomy.keys(),
  className: 'teleport-alert',
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      border: 'md',
      borderRadius: 'md',
      px: 4,
      py: 3,
      wordBreak: 'break-word',
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'full',
      flexShrink: '0',
      mr: 4,
      p: 2,
      lineHeight: '0',
    },
    content: {
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
      whiteSpace: 'pre-wrap',
    },
    title: {
      textStyle: 'h3',
    },
    description: {},
  },

  variants: {
    /**
     * The kind of the alert.
     */
    kind: {
      success: {
        root: {
          borderColor: 'interactive.solid.success.default',
          bg: 'interactive.tonal.success.0',
        },
        indicator: {
          color: 'text.primaryInverse',
          bg: 'interactive.solid.success.default',
        },
      },
      danger: {
        root: {
          borderColor: 'interactive.solid.danger.default',
          bg: 'interactive.tonal.danger.0',
        },
        indicator: {
          color: 'text.primaryInverse',
          bg: 'interactive.solid.danger.default',
        },
      },
      info: {
        root: {
          borderColor: 'interactive.solid.accent.default',
          bg: 'interactive.tonal.informational.0',
        },
        indicator: {
          color: 'text.primaryInverse',
          bg: 'interactive.solid.accent.default',
        },
      },
      warning: {
        root: {
          borderColor: 'interactive.solid.alert.default',
          bg: 'interactive.tonal.alert.0',
        },
        indicator: {
          color: 'text.primaryInverse',
          bg: 'interactive.solid.alert.default',
        },
      },
      neutral: {
        root: {
          border: 'sm',
          borderColor: 'text.disabled',
          bg: 'interactive.tonal.neutral.0',
        },
        indicator: {
          color: 'text.main',
          bg: 'interactive.tonal.neutral.0',
        },
      },
      cta: {
        root: {
          border: 'md',
          borderColor: 'interactive.solid.primary.default',
          bg: 'inherit',
        },
        indicator: {
          color: 'text.primaryInverse',
          bg: 'interactive.solid.primary.default',
        },
      },
    },
  },

  defaultVariants: {
    kind: 'danger',
  },
});
