import { defineTokens } from '@chakra-ui/react';

export const easings = defineTokens.easings({
  'ease-in': {
    value: 'cubic-bezier(0.42, 0, 1, 1)',
  },
  'ease-out': {
    value: 'cubic-bezier(0, 0, 0.58, 1)',
  },
  'ease-in-out': {
    value: 'cubic-bezier(0.42, 0, 0.58, 1)',
  },
  'ease-in-smooth': {
    value: 'cubic-bezier(0.32, 0.72, 0, 1)',
  },
  'material-standard': {
    value: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
});
