import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
  className: 'teleport-button',
  base: {
    display: 'inline-flex',
    lineHeight: '1.5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: '1.5px',
    borderColor: 'transparent',
    borderRadius: 'sm',
    cursor: 'button',
    px: 'calc({spacing.6} - 1.5px)',
    letterSpacing: '0.15px',
    gap: 2,
    fontWeight: 'bold',
    appearance: 'none',
    userSelect: 'none',
    position: 'relative',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    flexShrink: '0',
    outline: '0',
    isolation: 'isolate',
    transitionProperty: 'common',
    transitionDuration: 'moderate',
    focusVisibleRing: 'outside',
    _disabled: {
      layerStyle: 'disabled',
      bg: 'interactive.tonal.neutral.0',
      color: 'buttons.textDisabled',
      borderColor: 'transparent',
      boxShadow: 'none',
      cursor: 'auto',
    },
    _icon: {
      flexShrink: '0',
    },
  },

  variants: {
    /**
     * The size of the button.
     */
    size: {
      sm: {
        px: 'calc({spacing.2} - 1.5px)',
        gap: 1,
        minH: '{sizes.6}',
        minW: '{sizes.6}',
        fontSize: 1,
        lineHeight: '{sizes.4}',
        _icon: {
          width: '4',
          height: '4',
        },
      },
      md: {
        minH: '{sizes.8}',
        minW: '{sizes.8}',
        fontSize: 1,
        lineHeight: '{sizes.4}',
        _icon: {
          width: '5',
          height: '5',
        },
      },
      lg: {
        minH: '{sizes.10}',
        minW: '{sizes.10}',
        fontSize: 2,
        lineHeight: '{sizes.5}',
        letterSpacing: '0.175px',
        _icon: {
          width: '6',
          height: '6',
        },
      },
      xl: {
        minH: '{sizes.11}',
        minW: '{sizes.11}',
        fontSize: 3,
        lineHeight: '{sizes.6}',
        letterSpacing: '0.2px',
        gap: 3,
        _icon: {
          width: '7',
          height: '7',
        },
      },
    },
    /**
     * Fill specifies the desired shape of the button.
     */
    fill: {
      filled: {},
      minimal: {},
      border: {},
      link: {
        bg: 'none',
        color: 'buttons.link.default',
        fontWeight: 'normal',
        textDecoration: 'underline',
        textTransform: 'none',
        px: '2',
        _hover: {
          bg: 'levels.surface',
          color: 'buttons.link.hover',
          boxShadow: 'none',
        },
        _active: {
          bg: 'levels.surface',
          color: 'buttons.link.active',
        },
        _focusVisible: {
          borderColor: 'buttons.link.default',
          boxShadow: 'none',
          bg: 'levels.surface',
          color: 'buttons.link.hover',
        },
      },
    },
    /**
     * Specifies the button's purpose class and affects its color palette.
     */
    intent: {
      neutral: {},
      primary: {},
      danger: {},
      success: {},
    },
    /**
     * If `true`, the button will take the full width of its container.
     */
    block: {
      true: {
        w: '100%',
      },
    },
    /**
     * Reduces the horizontal padding to make the button more compact.
     */
    compact: {
      true: {
        px: 'calc({spacing.1} - 1.5px)',
      },
    },
    /**
     * If `true`, the button will have adjusted padding to align with input fields.
     */
    inputAlignment: {
      true: {
        px: 'calc({spacing.4} - 1.5px)',
      },
    },
  },

  compoundVariants: [
    // filled
    {
      intent: 'primary',
      fill: 'filled',
      css: {
        bg: 'interactive.solid.primary.default',
        color: 'text.primaryInverse',
        _hover: {
          bg: 'interactive.solid.primary.hover',
        },
        _active: {
          bg: 'interactive.solid.primary.active',
        },
        _focusVisible: {
          bg: 'interactive.solid.primary.default',
          outlineColor: 'interactive.solid.primary.default',
        },
      },
    },
    {
      intent: 'danger',
      fill: 'filled',
      css: {
        bg: 'interactive.solid.danger.default',
        color: 'text.primaryInverse',
        _hover: {
          bg: 'interactive.solid.danger.hover',
        },
        _active: {
          bg: 'interactive.solid.danger.active',
        },
        _focusVisible: {
          bg: 'interactive.solid.danger.default',
          outlineColor: 'interactive.solid.danger.default',
        },
      },
    },
    {
      intent: 'success',
      fill: 'filled',
      css: {
        bg: 'interactive.solid.success.default',
        color: 'text.primaryInverse',
        _hover: {
          bg: 'interactive.solid.success.hover',
        },
        _active: {
          bg: 'interactive.solid.success.active',
        },
        _focusVisible: {
          bg: 'interactive.solid.success.default',
          outlineColor: 'interactive.solid.success.default',
        },
      },
    },
    {
      intent: 'neutral',
      fill: 'filled',
      css: {
        color: 'text.slightlyMuted',
        bg: 'interactive.tonal.neutral.0',
        _hover: {
          color: 'text.main',
          bg: 'interactive.tonal.neutral.1',
        },
        _active: {
          color: 'text.main',
          bg: 'interactive.tonal.neutral.2',
        },
        _focusVisible: {
          color: 'text.slightlyMuted',
          bg: 'interactive.tonal.neutral.0',
          outlineColor: 'text.slightlyMuted',
        },
        _disabled: {
          _hover: {
            bg: 'interactive.tonal.neutral.0',
            color: 'text.slightlyMuted',
          },
        },
      },
    },

    // minimal
    {
      intent: 'primary',
      fill: 'minimal',
      css: {
        bg: 'transparent',
        color: 'interactive.solid.primary.default',
        _hover: {
          bg: 'interactive.tonal.primary.0',
          color: 'interactive.solid.primary.hover',
        },
        _active: {
          bg: 'interactive.tonal.primary.1',
          color: 'interactive.solid.primary.active',
        },
        _focusVisible: {
          color: 'interactive.solid.primary.default',
          borderColor: 'interactive.solid.primary.default',
          outline: 0,
        },
      },
    },
    {
      intent: 'danger',
      fill: 'minimal',
      css: {
        bg: 'transparent',
        color: 'interactive.solid.danger.default',
        _hover: {
          bg: 'interactive.tonal.danger.0',
          color: 'interactive.solid.danger.hover',
        },
        _active: {
          bg: 'interactive.tonal.danger.1',
          color: 'interactive.solid.danger.active',
        },
        _focusVisible: {
          color: 'interactive.solid.danger.default',
          borderColor: 'interactive.solid.danger.default',
          outline: 0,
        },
      },
    },
    {
      intent: 'success',
      fill: 'minimal',
      css: {
        bg: 'transparent',
        color: 'interactive.solid.success.default',
        _hover: {
          bg: 'interactive.tonal.success.0',
          color: 'interactive.solid.success.hover',
        },
        _active: {
          bg: 'interactive.tonal.success.1',
          color: 'interactive.solid.success.active',
        },
        _focusVisible: {
          color: 'interactive.solid.success.default',
          borderColor: 'interactive.solid.success.default',
          outline: 0,
        },
      },
    },
    {
      intent: 'neutral',
      fill: 'minimal',
      css: {
        color: 'text.slightlyMuted',
        bg: 'transparent',
        _hover: {
          bg: 'interactive.tonal.neutral.0',
        },
        _active: {
          color: 'text.main',
          bg: 'interactive.tonal.neutral.1',
        },
        _focusVisible: {
          color: 'text.slightlyMuted',
          borderColor: 'text.slightlyMuted',
        },
      },
    },

    // border
    {
      intent: 'primary',
      fill: 'border',
      css: {
        bg: 'transparent',
        color: 'interactive.solid.primary.default',
        borderColor: 'interactive.solid.primary.default',
        _hover: {
          color: 'text.primaryInverse',
          bg: 'interactive.solid.primary.hover',
          borderColor: 'transparent',
        },
        _active: {
          color: 'text.primaryInverse',
          bg: 'interactive.solid.primary.active',
          borderColor: 'transparent',
        },
        _focusVisible: {
          color: 'text.primaryInverse',
          borderColor: 'text.primaryInverse',
          bg: 'interactive.solid.primary.default',
        },
      },
    },
    {
      intent: 'danger',
      fill: 'border',
      css: {
        bg: 'transparent',
        color: 'interactive.solid.danger.default',
        borderColor: 'interactive.solid.danger.default',
        _hover: {
          color: 'text.primaryInverse',
          bg: 'interactive.solid.danger.hover',
          borderColor: 'transparent',
        },
        _active: {
          color: 'text.primaryInverse',
          bg: 'interactive.solid.danger.active',
          borderColor: 'transparent',
        },
        _focusVisible: {
          color: 'text.primaryInverse',
          borderColor: 'text.primaryInverse',
          bg: 'interactive.solid.danger.default',
        },
      },
    },
    {
      intent: 'success',
      fill: 'border',
      css: {
        bg: 'transparent',
        color: 'interactive.solid.success.default',
        borderColor: 'interactive.solid.success.default',
        _hover: {
          color: 'text.primaryInverse',
          bg: 'interactive.solid.success.hover',
          borderColor: 'transparent',
        },
        _active: {
          color: 'text.primaryInverse',
          bg: 'interactive.solid.success.active',
          borderColor: 'transparent',
        },
        _focusVisible: {
          color: 'text.primaryInverse',
          borderColor: 'text.primaryInverse',
          bg: 'interactive.solid.success.default',
        },
      },
    },
    {
      intent: 'neutral',
      fill: 'border',
      css: {
        bg: 'transparent',
        color: 'text.slightlyMuted',
        borderColor: 'interactive.tonal.neutral.2',
        _hover: {
          color: 'text.main',
          bg: 'interactive.tonal.neutral.1',
        },
        _active: {
          color: 'text.main',
          bg: 'interactive.tonal.neutral.2',
          borderColor: 'transparent',
        },
        _focusVisible: {
          color: 'text.slightlyMuted',
          borderColor: 'text.slightlyMuted',
          bg: 'interactive.tonal.neutral.0',
        },
      },
    },
  ],

  defaultVariants: {
    size: 'md',
    intent: 'primary',
    fill: 'filled',
  },
});
