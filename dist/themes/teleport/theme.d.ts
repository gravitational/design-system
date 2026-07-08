import { type ColorMode } from '../../theme';
import { type UiTheme } from '../theme';
export declare const system: import("@chakra-ui/react").SystemContext;
export declare const TELEPORT_THEME: UiTheme;
/**
 * Resolves a teleport color token to a CSS color string for the given color
 * mode, substituting any embedded `{token.path}` references. Thin wrapper
 * over {@link resolveColorToken} bound to the teleport system, for callers
 * that can't rely on CSS custom properties (e.g. canvas/WebGL painting or
 * the Electron main process).
 */
export declare function resolveTeleportColor(tokenName: string, mode: ColorMode): string | undefined;
