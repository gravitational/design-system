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
        themes['Light Theme'] = {
          colorScheme: 'light',
          system,
          name: 'Light Theme',
        };
        themes['Dark Theme'] = {
          colorScheme: 'dark',
          system,
          name: 'Dark Theme',
        };

        break;
    }
  }

  return themes;
}
