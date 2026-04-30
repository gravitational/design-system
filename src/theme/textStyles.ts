import { defineTextStyles } from '@chakra-ui/react';

export const textStyles = defineTextStyles({
  h1: {
    value: {
      fontSize: '24px',
      fontWeight: '{fontWeights.medium}',
      lineHeight: '32px',
    },
  },
  h2: {
    value: {
      fontSize: '18px',
      fontWeight: '{fontWeights.medium}',
      lineHeight: '24px',
    },
  },
  h3: {
    value: {
      fontSize: '14px',
      fontWeight: '{fontWeights.bold}',
      lineHeight: '20px',
    },
  },
  h4: {
    value: {
      fontSize: '12px',
      fontWeight: '{fontWeights.medium}',
      lineHeight: '20px',
      letterSpacing: '0.03px',
    },
  },
  subtitle1: {
    value: {
      fontSize: '16px',
      fontWeight: '{fontWeights.light}',
      lineHeight: '24px',
      letterSpacing: '0.024px',
    },
  },
  subtitle2: {
    value: {
      fontSize: '14px',
      fontWeight: '{fontWeights.light}',
      lineHeight: '20px',
      letterSpacing: '0.014px',
    },
  },
  subtitle3: {
    value: {
      fontSize: '12px',
      fontWeight: '{fontWeights.regular}',
      lineHeight: '20px',
      letterSpacing: '0.012px',
    },
  },
  body1: {
    value: {
      fontSize: '16px',
      fontWeight: '{fontWeights.regular}',
      lineHeight: '24px',
      letterSpacing: '0.08px',
    },
  },
  body2: {
    value: {
      fontSize: '14px',
      fontWeight: '{fontWeights.regular}',
      lineHeight: '20px',
      letterSpacing: '0.035px',
    },
  },
  body3: {
    value: {
      fontSize: '12px',
      fontWeight: '{fontWeights.regular}',
      lineHeight: '20px',
      letterSpacing: '0.015px',
    },
  },
  body4: {
    value: {
      fontSize: '10px',
      fontWeight: '{fontWeights.regular}',
      lineHeight: '16px',
      letterSpacing: '0.013px',
    },
  },
  caption: {
    value: {
      fontSize: '10px',
      fontWeight: '{fontWeights.regular}',
      lineHeight: '12px',
      letterSpacing: '0.04px',
    },
  },
  overline: {
    value: {
      fontSize: '10px',
      fontWeight: '{fontWeights.regular}',
      lineHeight: '12px',
      letterSpacing: '0.15px',
    },
  },
});
