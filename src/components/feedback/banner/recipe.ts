import { defineSlotRecipe } from '@chakra-ui/react';

export const bannerSlotRecipe = defineSlotRecipe({
  slots: ['root', 'indicator', 'content', 'title', 'description'],
  className: 'teleport-banner',
  base: {
    root: {
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      px: 4,
      py: 2,
      borderBottom: 'md',
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      lineHeight: '0',
    },
    content: {
      display: 'flex',
      flex: '1',
      flexDirection: 'column',
    },
    title: {
      fontWeight: 'bold',
      textStyle: 'sm',
    },
    description: {
      display: 'inline',
      textStyle: 'sm',
    },
  },

  variants: {
    /**
     * The kind of the banner.
     */
    kind: {
      primary: {
        root: {
          bg: 'interactive.tonal.primary.2',
          borderColor: 'interactive.solid.primary.default',
        },
        indicator: {
          color: 'text.main',
        },
      },
      neutral: {
        root: {
          bg: 'levels.elevated',
          borderColor: 'text.main',
        },
        indicator: {
          color: 'text.main',
        },
      },
      danger: {
        root: {
          bg: 'interactive.tonal.danger.2',
          borderColor: 'interactive.solid.danger.default',
        },
        indicator: {
          color: 'interactive.solid.danger.default',
        },
      },
      warning: {
        root: {
          bg: 'interactive.tonal.alert.2',
          borderColor: 'interactive.solid.alert.default',
        },
        indicator: {
          color: 'interactive.solid.alert.default',
        },
      },
      info: {
        root: {
          bg: 'interactive.tonal.informational.2',
          borderColor: 'interactive.solid.accent.default',
        },
        indicator: {
          color: 'interactive.solid.accent.default',
        },
      },
      success: {
        root: {
          bg: 'interactive.tonal.success.2',
          borderColor: 'interactive.solid.success.default',
        },
        indicator: {
          color: 'interactive.solid.success.default',
        },
      },
    },
  },

  defaultVariants: {
    kind: 'danger',
  },
});
