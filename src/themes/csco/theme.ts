import { defineConfig, mergeConfigs } from '@chakra-ui/react';

import { TELEPORT_THEME } from '../teleport';
import { UiThemeMode, type UiTheme } from '../theme';
import { colors } from './colors';

const overrides = defineConfig({
  theme: {
    semanticTokens: {
      colors,
    },
  },
});

export const CSCO_THEME: UiTheme = {
  isCustom: true,
  mode: UiThemeMode.LightAndDark,
  name: 'csco',
  storybookName: 'CSCO',
  config: mergeConfigs(TELEPORT_THEME.config, overrides),
};
