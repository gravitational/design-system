import { defineSlotRecipe } from '@chakra-ui/react';
import { menuAnatomy } from '@chakra-ui/react/anatomy';

const itemBase = {
  textDecoration: 'none',
  color: 'text.main',
  userSelect: 'none',
  width: '100%',
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  textAlign: 'start',
  position: 'relative',
  flex: '0 0 auto',
  outline: 0,
  transition: 'background-color 150ms ease, color 150ms ease',
  _highlighted: {
    bg: 'interactive.tonal.neutral.0',
  },
  _disabled: {
    layerStyle: 'disabled',
    cursor: 'default',
  },
} as const;

export const menuSlotRecipe = defineSlotRecipe({
  className: 'teleport-menu',
  slots: menuAnatomy.keys(),
  base: {
    content: {
      '--menu-bg': 'colors.levels.elevated',
      '--menu-z-index': 'zIndex.menu',
      bg: 'var(--menu-bg)',
      color: 'text.main',
      boxShadow: 'lg',
      borderRadius: 'sm',
      minW: '36',
      // Same-color border instead of padding so sticky elements (e.g.
      // search inputs) sit flush against content edge. Items can't
      // scroll through border space the way they can through padding.
      borderBlockStyle: 'solid',
      borderBlockWidth: '{spacing.1}',
      borderBlockColor: 'var(--menu-bg)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollbarWidth: 'thin',
      scrollbarColor: '{colors.interactive.tonal.neutral.2} transparent',
      maxHeight: 'inherit',
      zIndex: 'calc(var(--menu-z-index) + var(--layer-index, 0))',
      outline: 'none',
      transformOrigin: 'var(--transform-origin)',
      _open: {
        animationStyle: 'scale-fade-in',
        animationDuration: 'fast',
      },
      _closed: {
        animationStyle: 'scale-fade-out',
        animationDuration: 'fast',
      },
    },
    item: itemBase,
    triggerItem: itemBase,
    itemText: {
      flex: '1',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    itemIndicator: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemGroupLabel: {
      color: 'text.muted',
    },
    indicator: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
    },
    itemCommand: {
      ms: 'auto',
      ps: 4,
      color: 'text.muted',
      opacity: 0.6,
      fontFamily: 'inherit',
      fontWeight: 400,
      letterSpacing: 'widest',
    },
    separator: {
      border: 'none',
      borderBottom: '1px solid',
      borderColor: 'interactive.tonal.neutral.2',
      my: 1,
    },
    arrow: {
      '--arrow-size': 'sizes.3',
      '--arrow-background': 'var(--menu-bg)',
    },
    arrowTip: {
      borderTopWidth: '1px',
      borderInlineStartWidth: '1px',
      borderColor: 'var(--menu-bg)',
    },
  },
  variants: {
    size: {
      sm: {
        item: {
          gap: 1,
          textStyle: 'body3',
          py: 1,
          px: 2,
        },
        triggerItem: {
          gap: 1,
          textStyle: 'body3',
          py: 1,
          px: 2,
        },
        itemGroupLabel: {
          textStyle: 'subtitle3',
          px: 2,
          py: 1,
        },
        itemCommand: {
          fontSize: 0,
        },
      },
      md: {
        item: {
          gap: 2,
          textStyle: 'body2',
          py: 2,
          px: 3,
        },
        triggerItem: {
          gap: 2,
          textStyle: 'body2',
          py: 2,
          px: 3,
        },
        itemGroupLabel: {
          textStyle: 'subtitle3',
          px: 3,
          py: 1,
        },
        itemCommand: {
          fontSize: 1,
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
