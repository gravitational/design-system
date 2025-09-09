import type { SystemConfig } from '@chakra-ui/react';

export enum UiThemeMode {
  SingleColor,
  LightAndDark,
  ForcedColor,
}

interface BaseUiTheme {
  isCustom?: boolean;
  name: string;
  config: SystemConfig;
}

interface UiThemeWithForcedColor extends BaseUiTheme {
  mode: UiThemeMode.ForcedColor;
  forcedColorMode: 'light' | 'dark';
}

interface UiThemeWithSingleColor extends BaseUiTheme {
  mode: UiThemeMode.SingleColor;
  storybookName: string;
  color: 'light' | 'dark';
}

interface UiThemeDefault extends BaseUiTheme {
  mode: UiThemeMode.LightAndDark;
}

export type UiTheme =
  | UiThemeDefault
  | UiThemeWithForcedColor
  | UiThemeWithSingleColor;
