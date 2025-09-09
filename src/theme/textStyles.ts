import { defineTextStyles } from '@chakra-ui/react';

export const textStyles = defineTextStyles({
  body1: {
    value: {
      fontSize: '16px',
      fontWeight: '{fontWeights.light}',
      lineHeight: '24px',
      letterSpacing: '0.08px',
    },
  },
  body2: {
    value: {
      fontSize: '14px',
      fontWeight: '{fontWeights.light}',
      lineHeight: '24px',
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

  /**
   * Don't use directly, prefer the `H1` component except for text that doesn't
   * introduce document structure.
   */
  h1: {
    value: {
      fontWeight: '{fontWeights.medium}',
      fontSize: '24px',
      lineHeight: '32px',
    },
  },
  /**
   * Don't use directly, prefer the `H2` component except for text that doesn't
   * introduce document structure.
   */
  h2: {
    value: {
      fontWeight: '{fontWeights.medium}',
      fontSize: '18px',
      lineHeight: '24px',
    },
  },
  /**
   * Don't use directly, prefer the `H3` component except for text that doesn't
   * introduce document structure.
   */
  h3: {
    value: {
      fontWeight: '{fontWeights.bold}',
      fontSize: '14px',
      lineHeight: '20px',
    },
  },
  h4: {
    value: {
      fontWeight: '{fontWeights.medium}',
      fontSize: '12px',
      lineHeight: '20px',
      letterSpacing: '0.03px',
      textTransform: 'uppercase',
    },
  },
  subtitle1: {
    value: {
      fontSize: '16px',
      fontWeight: '{fontWeights.regular}',
      lineHeight: '24px',
      letterSpacing: '0.024px',
    },
  },
  subtitle2: {
    value: {
      fontSize: '14px',
      fontWeight: '{fontWeights.regular}',
      lineHeight: '20px',
      letterSpacing: '0.014px',
    },
  },
  subtitle3: {
    value: {
      fontSize: '12px',
      fontWeight: '{fontWeights.bold}',
      lineHeight: '20px',
      letterSpacing: '0.012px',
    },
  },
  table: {
    value: {
      fontWeight: '{fontWeights.light}',
      fontSize: '14px',
      lineHeight: '20px',
      letterSpacing: '0.035px',
    },
  },
  dropdownTitle: {
    value: {
      fontWeight: '{fontWeights.bold}',
      fontSize: '14px',
      lineHeight: '20px',
    },
  },
});
