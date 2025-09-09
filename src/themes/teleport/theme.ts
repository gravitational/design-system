import { defineConfig } from '@chakra-ui/react';

import { createThemeSystem } from '../../theme';
import { UiThemeMode, type UiTheme } from '../theme';
import { colors } from './colors';

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors,
    },
  },
});

export const system = createThemeSystem(config);

export const TELEPORT_THEME: UiTheme = {
  mode: UiThemeMode.LightAndDark,
  name: 'teleport',
  config,
};
