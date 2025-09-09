import { defineConfig } from '@chakra-ui/react';

import { UiThemeMode, type UiTheme } from '../theme';
import { colors } from './colors';

const config = defineConfig({
  theme: {
    tokens: {
      colors,
    },
  },
});

export const BBLP_THEME: UiTheme = {
  isCustom: true,
  mode: UiThemeMode.SingleColor,
  color: 'dark',
  name: 'bblp',
  storybookName: 'BBLP Theme',
  config,
};
