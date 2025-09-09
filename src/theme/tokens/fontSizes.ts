import { defineTokens } from '@chakra-ui/react';

export const fontSizes = defineTokens.fontSizes({
  0: {
    value: '10px',
  },
  1: {
    value: '12px',
  },
  2: {
    value: '14px',
  },
  3: {
    value: '16px',
  },
  4: {
    value: '18px',
  },
  5: {
    value: '20px',
  },
  6: {
    value: '22px',
  },
  7: {
    value: '24px',
  },
  8: {
    value: '26px',
  },
  9: {
    value: '28px',
  },
  10: {
    value: '34px',
  },
  xs: {
    value: '{fontSizes.0}',
  },
  sm: {
    value: '{fontSizes.1}',
  },
  md: {
    value: '{fontSizes.2}',
  },
  lg: {
    value: '{fontSizes.6}',
  },
  xl: {
    value: '{fontSizes.10}',
  },
});
