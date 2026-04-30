import { defineRecipe } from '@chakra-ui/react';

export const inputRecipe = defineRecipe({
  className: 'teleport-input',
  base: {
    appearance: 'none',
    width: '100%',
    minWidth: '0',
    outline: '0',
    position: 'relative',
    textAlign: 'start',
    display: 'block',
    borderRadius: 'sm',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'interactive.tonal.neutral.2',
    bg: 'transparent',
    color: 'text.main',
    height: 'var(--input-height)',
    minH: 'var(--input-height)',
    transitionProperty: 'border-color, background-color, box-shadow',
    transitionDuration: 'moderate',
    px: 4,
    _placeholder: {
      color: 'text.muted',
      opacity: 1,
    },
    _hover: {
      borderColor: 'text.muted',
    },
    _focusVisible: {
      borderColor: 'interactive.solid.primary.default',
      _hover: {
        borderColor: 'interactive.solid.primary.default',
      },
    },
    _readOnly: {
      cursor: 'not-allowed',
      _hover: {
        borderColor: 'interactive.tonal.neutral.2',
      },
      _focusVisible: {
        borderColor: 'interactive.tonal.neutral.2',
      },
    },
    _disabled: {
      bg: 'interactive.tonal.neutral.0',
      color: 'text.disabled',
      borderColor: 'transparent',
      cursor: 'not-allowed',
      _placeholder: {
        color: 'text.disabled',
      },
    },
    _invalid: {
      borderColor: 'interactive.solid.danger.default',
      _hover: {
        borderColor: 'interactive.solid.danger.default',
      },
    },
    '&::-ms-clear': {
      display: 'none',
    },
  },
  variants: {
    size: {
      sm: {
        textStyle: 'body3',
        '--input-height': 'sizes.8',
        _hasIcon: { paddingInlineStart: '40px' },
        _invalid: { paddingInlineEnd: '32px' },
      },
      md: {
        textStyle: 'body2',
        '--input-height': 'sizes.10',
        _hasIcon: { paddingInlineStart: '42px' },
        _invalid: { paddingInlineEnd: '34px' },
      },
      lg: {
        textStyle: 'body1',
        '--input-height': 'sizes.12',
        _hasIcon: { paddingInlineStart: '48px' },
        _invalid: { paddingInlineEnd: '40px' },
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
});
