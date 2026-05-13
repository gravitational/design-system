import type { SystemContext } from '@chakra-ui/react';

import { cssVarToTokenPath } from './legacy';
import { resolveColorToken, type ColorMode } from './resolveColorToken';

export type TokenTree = string | { [key: string]: TokenTree };

type ResolvedTokenTree<T> = T extends string
  ? string | undefined
  : // oxlint-disable-next-line typescript/no-explicit-any
    T extends Record<string, any>
    ? { [K in keyof T]: ResolvedTokenTree<T[K]> }
    : never;

/**
 * Resolves an object of color tokens to their CSS color values for the given
 * color mode. Multi-value counterpart to {@link resolveColorToken}.
 *
 * Useful when a caller has a fixed shape they want to fill in (e.g. an xterm
 * theme, a map of SVG fills) and wants the resolved values to depend only on
 * the active mode rather than on whatever class is currently applied to
 * `document.documentElement`. That makes the result safe to derive
 * synchronously during render and avoids the timing mismatch with
 * `next-themes`, which only updates the DOM class after children have already
 * rendered.
 *
 * Leaves can be either Chakra token names (e.g. `'colors.terminal.foreground'`)
 * or the generated var-string references (e.g.
 * `'var(--teleport-colors-terminal-foreground)'`). The latter lets callers
 * pass the existing styled-components subtree such as `theme.colors.terminal`
 * directly. The output mirrors the input shape with each leaf replaced by the
 * resolved CSS color string, or `undefined` when the token can't be resolved.
 */
export function resolveColorTokens<T extends TokenTree>(
  system: SystemContext,
  tokens: T,
  mode: ColorMode
): ResolvedTokenTree<T> {
  if (typeof tokens === 'string') {
    const tokenName = cssVarToTokenPath.get(tokens) ?? tokens;
    return resolveColorToken(system, tokenName, mode) as ResolvedTokenTree<T>;
  }

  const resolved: Record<string, ResolvedTokenTree<TokenTree>> = {};

  for (const [key, value] of Object.entries(tokens)) {
    resolved[key] = resolveColorTokens(system, value, mode);
  }

  return resolved as ResolvedTokenTree<T>;
}
