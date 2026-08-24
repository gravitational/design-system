import type { SystemContext } from '@chakra-ui/react';

import { createThemeSystem, THEMES, UiThemeMode } from '../src';
import { storybookConfig } from './storybookTheme';

export interface StorybookTheme {
  colorScheme: string;
  system: SystemContext;
  name: string;
}

export function getThemes() {
  const themes: Record<string, StorybookTheme> = {};

  for (const theme of THEMES) {
    const system = createThemeSystem(storybookConfig, theme.config);

    switch (theme.mode) {
      case UiThemeMode.SingleColor:
        themes[theme.storybookName] = {
          colorScheme: theme.color,
          system,
          name: theme.storybookName,
        };

        break;

      case UiThemeMode.ForcedColor:
        continue;

      case UiThemeMode.LightAndDark:
        const prefix = theme.storybookName ? `${theme.storybookName} ` : '';
        const lightThemeName = `${prefix}Light Theme`;
        const darkThemeName = `${prefix}Dark Theme`;

        themes[lightThemeName] = {
          colorScheme: 'light',
          system,
          name: lightThemeName,
        };
        themes[darkThemeName] = {
          colorScheme: 'dark',
          system,
          name: darkThemeName,
        };

        break;
    }
  }

  return themes;
}
