import { TELEPORT_THEME } from '../teleport';
import { UiThemeMode, type UiTheme } from '../theme';

export const MC_THEME: UiTheme = {
  mode: UiThemeMode.ForcedColor,
  forcedColorMode: 'light',
  name: 'mc',
  config: TELEPORT_THEME.config,
};
