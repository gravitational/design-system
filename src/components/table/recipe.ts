import { defineSlotRecipe } from '@chakra-ui/react';
import { tableAnatomy } from '@chakra-ui/react/anatomy';

export const tableSlotRecipe = defineSlotRecipe({
  className: 'teleport-table',
  slots: tableAnatomy.keys(),
  base: {
    root: {
      borderCollapse: 'collapse',
      borderSpacing: 0,
      borderStyle: 'hidden',
      width: 'full',
      fontSize: 2,
      '& > thead > tr > th, & > tbody > tr > td, & > tfoot > tr > td': {
        py: 2,
        px: 2,
        verticalAlign: 'middle',
        '&:first-child': {
          paddingInlineStart: 5,
        },
        '&:last-child': {
          paddingInlineEnd: 5,
        },
      },
    },
    columnHeader: {
      color: 'text.main',
      textStyle: 'h3',
      lineHeight: '{sizes.6}',
      textAlign: 'start',
      whiteSpace: 'nowrap',
      py: 0,
      cursor: 'default',
      '& svg': {
        height: '{sizes.3}',
      },
    },
    cell: {
      color: 'text.main',
      textStyle: 'table',
      verticalAlign: 'middle',
    },
    row: {
      transitionProperty: 'common',
      transitionDuration: '150ms',
      position: 'relative',
      borderTop: 'md',
      borderTopColor: 'interactive.tonal.neutral.0',
      _hover: {
        borderTopColor: 'transparent',
        bg: 'levels.surface',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: -1,
          width: '100%',
          height: '100%',
          boxShadow: 'sm',
        },
        '& + tr': {
          borderTopColor: 'transparent',
        },
      },
    },
  },
  variants: {
    size: {
      sm: {
        root: { textStyle: 'sm' },
        columnHeader: { px: 2, py: 2 },
        cell: { px: 2, py: 2 },
      },
      md: {
        root: { textStyle: 'sm' },
        columnHeader: { px: 4, py: 4 },
        cell: { px: 4, py: 4 },
      },
      lg: {
        root: { textStyle: 'md' },
        columnHeader: { px: 5, py: 4 },
        cell: { px: 5, py: 4 },
      },
    },
    variant: {
      line: {
        columnHeader: { borderBottomWidth: '1px' },
        cell: { borderBottomWidth: '1px' },
      },
      outline: {
        root: { boxShadow: '0 0 0 1px {colors.interactive.tonal.neutral.1}' },
        columnHeader: { borderBottomWidth: '1px' },
        header: { bg: 'interactive.tonal.neutral.0' },
        row: {
          '&:not(:last-of-type)': { borderBottomWidth: '1px' },
        },
        footer: { borderTopWidth: '1px' },
      },
    },
  },
});
