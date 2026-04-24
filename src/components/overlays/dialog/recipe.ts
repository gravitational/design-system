import { defineSlotRecipe } from '@chakra-ui/react';
import { dialogAnatomy } from '@chakra-ui/react/anatomy';

export const dialogSlotRecipe = defineSlotRecipe({
  className: 'teleport-dialog',
  slots: dialogAnatomy.keys(),
  base: {
    backdrop: {
      bg: 'blackAlpha.600',
      zIndex: 'modal',
      position: 'fixed',
      inset: 0,
    },
    positioner: {
      zIndex: 'modal',
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 'none',
      overflow: 'auto',
    },
    content: {
      bg: 'levels.surface',
      color: 'text.main',
      borderRadius: 'md',
      boxShadow: 'dialog',
      px: 6,
      pt: 5,
      pb: 6,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      maxH: 'calc(100% - 96px)',
      overflowY: 'auto',
      zIndex: 'modal',
      _open: {
        animationStyle: 'fade-in',
        animationDuration: 'dialog',
      },
      _closed: {
        animationStyle: 'fade-out',
        animationDuration: 'dialog',
      },
    },
    header: {
      minH: 8,
      mb: 3,
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    },
    title: {
      textStyle: 'h2',
    },
    body: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
      mb: 5,
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 2,
    },
    closeTrigger: {
      position: 'absolute',
      top: 3,
      insetEnd: 3,
    },
  },
});
