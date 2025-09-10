import { defineRecipe } from '@chakra-ui/react';

export const groupRecipe = defineRecipe({
  base: {
    display: 'inline-flex',
    gap: 'var(--group-gap, 0.5rem)',
    isolation: 'isolate',
    position: 'relative',
    '& [data-group-item]': {
      _focusVisible: {
        zIndex: 1,
      },
    },
  },
  variants: {
    orientation: {
      horizontal: {
        flexDirection: 'row',
      },
      vertical: {
        flexDirection: 'column',
      },
    },
    attached: {
      true: {
        gap: '0!',
      },
    },
    grow: {
      true: {
        display: 'flex',
        '& > *': {
          flex: 1,
        },
      },
    },
    stacking: {
      'first-on-top': {
        '& > [data-group-item]': {
          zIndex: 'calc(var(--group-count) - var(--group-index))',
        },
      },
      'last-on-top': {
        '& > [data-group-item]': {
          zIndex: 'var(--group-index)',
        },
      },
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      attached: true,
      css: {
        '& > *[data-first]': {
          borderEndRadius: '0!',
        },
        '& > *[data-between]': {
          borderRadius: '0!',
          borderLeft: 'none',
        },
        '& > *[data-last]': {
          borderStartRadius: '0!',
          borderLeft: 'none',
        },
      },
    },
    {
      orientation: 'vertical',
      attached: true,
      css: {
        '& > *[data-first]': {
          borderBottomRadius: '0!',
          marginBottom: '-1px',
        },
        '& > *[data-between]': {
          borderRadius: '0!',
          marginBottom: '-1px',
        },
        '& > *[data-last]': {
          borderTopRadius: '0!',
        },
      },
    },
  ],
  defaultVariants: {
    orientation: 'horizontal',
  },
});
