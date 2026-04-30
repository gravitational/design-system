import { defineSlotRecipe, defineStyle } from '@chakra-ui/react';
import { datePickerAnatomy } from '@ark-ui/react/date-picker';

const navTriggerStyle = defineStyle({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSize: '8',
  borderRadius: 'sm',
  color: 'text.main',
  bg: 'transparent',
  _hover: {
    bg: 'interactive.tonal.neutral.1',
  },
  _disabled: {
    color: 'text.disabled',
    cursor: 'not-allowed',
  },
  '& svg': {
    boxSize: '4',
    fill: 'currentColor',
  },
});

export const datePickerSlotRecipe = defineSlotRecipe({
  className: 'teleport-date-picker',
  slots: datePickerAnatomy.keys(),
  base: {
    root: {
      display: 'inline-flex',
      flexDirection: 'column',
    },

    label: {
      textStyle: 'sm',
      fontWeight: 'medium',
      color: 'text.slightlyMuted',
    },

    control: {
      display: 'flex',
      alignItems: 'center',
      gap: '2',
      position: 'relative',
    },

    input: {
      flex: '1',
      minWidth: '0',
      height: '10',
      px: '3',
      textStyle: 'sm',
      bg: 'transparent',
      borderWidth: '1px',
      borderColor: 'interactive.tonal.neutral.1',
      borderRadius: 'sm',
      color: 'text.main',
      _placeholder: { color: 'text.muted' },
    },

    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '6',
      height: '6',
      borderRadius: 'sm',
      color: 'text.muted',
      _hover: { color: 'text.main' },
    },

    clearTrigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '6',
      height: '6',
      color: 'text.muted',
      _hover: { color: 'text.main' },
    },

    content: {
      position: 'relative',
      boxSizing: 'border-box',
      bg: 'levels.popout',
      boxShadow: 'lg',
      borderRadius: 'sm',
      minW: '18rem',
      px: '4',
      py: '3',
      display: 'flex',
      flexDirection: 'column',
      gap: '3',
      zIndex: 'popover',
      _open: {
        animationStyle: 'scale-fade-in',
        animationDuration: 'fast',
      },
      _closed: {
        animationStyle: 'scale-fade-out',
        animationDuration: 'faster',
      },
    },

    view: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2',
      '--table-cell-size': 'sizes.9',
    },

    viewControl: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '2',
      height: '8',
    },

    viewTrigger: {
      display: 'inline-flex',
      flex: '1',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1',
      py: '1',
      px: '2',
      textStyle: 'sm',
      fontWeight: 'semibold',
      color: 'text.main',
      bg: 'transparent',
      borderRadius: 'sm',
      _hover: { bg: 'interactive.tonal.neutral.1' },
    },

    prevTrigger: navTriggerStyle,
    nextTrigger: navTriggerStyle,

    rangeText: {
      textStyle: 'sm',
      fontWeight: 'semibold',
      color: 'text.main',
    },

    table: {
      borderCollapse: 'separate',
      borderSpacing: '0',
    },

    tableHeader: {
      width: 'var(--table-cell-size)',
      py: '2',
      textStyle: 'xs',
      fontWeight: 'medium',
      color: 'text.main',
      textAlign: 'center',
      textTransform: 'uppercase',
    },

    tableCell: {
      p: '0',
    },

    tableCellTrigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 'var(--table-cell-size)',
      minHeight: 'var(--table-cell-size)',
      '[data-view=month] &, [data-view=year] &': {
        width: 'calc(var(--table-cell-size) * 1.75)',
      },
      textStyle: 'sm',
      color: 'text.main',
      bg: 'transparent',
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: 'sm',
      cursor: 'pointer',
      _hover: {
        bg: 'interactive.tonal.neutral.2',
      },
      '&[data-today]': {
        color: 'text.main',
      },
      '&[data-selected]': {
        borderColor: 'interactive.tonal.neutral.2',
        color: 'text.main',
      },
      '&[data-in-range]': {
        bg: 'interactive.tonal.neutral.2',
        color: 'text.main',
        borderRadius: '0',
      },
      '&[data-range-start]': {
        bg: 'interactive.tonal.neutral.2',
        color: 'text.main',
      },
      '&[data-range-end]': {
        bg: 'interactive.tonal.neutral.2',
        color: 'text.main',
      },
      '&[data-in-hover-range]': {
        bg: 'interactive.tonal.neutral.2',
        color: 'text.main',
        borderRadius: '0',
      },
      _disabled: {
        color: 'text.disabled',
        cursor: 'not-allowed',
        _hover: { bg: 'transparent' },
      },
      '&[data-outside-range]': {
        color: 'text.muted',
      },
      '&[data-unavailable]': {
        color: 'text.disabled',
        cursor: 'not-allowed',
      },
    },

    monthSelect: {
      bg: 'transparent',
      color: 'text.main',
      borderRadius: 'sm',
      px: '2',
      py: '1',
    },
    yearSelect: {
      bg: 'transparent',
      color: 'text.main',
      borderRadius: 'sm',
      px: '2',
      py: '1',
    },
    presetTrigger: {
      textStyle: 'sm',
      color: 'text.main',
      bg: 'transparent',
      borderRadius: 'sm',
      px: '2',
      py: '1',
      _hover: { bg: 'interactive.tonal.neutral.1' },
    },
  },
});
