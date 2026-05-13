import { defineConfig } from '@chakra-ui/react';

import { createThemeSystem } from '../../theme';
import {
  resolveColorToken,
  resolveColorTokens,
  type ColorMode,
  type TokenTree,
} from '../../theme';
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

/**
 * Resolves a teleport color token to a CSS color string for the given color
 * mode, substituting any embedded `{token.path}` references. Thin wrapper
 * over {@link resolveColorToken} bound to the teleport system, for callers
 * that can't rely on CSS custom properties (e.g. canvas/WebGL painting or
 * the Electron main process).
 */
export function resolveTeleportColor(tokenName: string, mode: ColorMode) {
  return resolveColorToken(system, tokenName, mode);
}

/**
 * Multi-value counterpart to {@link resolveTeleportColor}. Resolves an object
 * whose leaves are teleport color token paths into the same shape with each
 * leaf replaced by its CSS color value for the given mode. See
 * {@link resolveColorTokens} for details.
 */
export function resolveTeleportColors<T extends TokenTree>(
  tokens: T,
  mode: ColorMode
) {
  return resolveColorTokens(system, tokens, mode);
}
