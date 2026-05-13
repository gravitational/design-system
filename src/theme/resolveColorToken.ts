import type { SystemContext } from '@chakra-ui/react';

export type ColorMode = 'light' | 'dark';

/**
 * Resolves a color token to a CSS color string for the given color mode,
 * recursively substituting any `{token.path}` and `var(--...)` references in
 * the value.
 *
 * For callers that can't rely on the document's CSS custom properties being
 * applied — e.g. canvas/WebGL painting, or any code running outside the
 * rendered DOM.
 *
 * Simple tokens reduce to a primitive like `#FF0000` or `rgba(...)`. Tokens
 * whose value is a CSS expression such as
 * `color-mix(in srgb, white 50%, {colors.levels.sunken})` reduce to the same
 * expression with references substituted — the consumer still needs to be
 * able to render whatever CSS color syntax the token uses.
 *
 * Returns `undefined` if the token doesn't exist, has no value for the
 * requested mode, or contains an unresolvable / cyclic reference.
 */
export function resolveColorToken(
  system: SystemContext,
  tokenName: string,
  mode: ColorMode
) {
  return resolveTokenValue(system, tokenName, mode);
}

function resolveTokenValue(
  system: SystemContext,
  tokenName: string,
  mode: ColorMode,
  seen = new Set<string>()
): string | undefined {
  const cssVar = lookupCssVar(system, tokenName);
  if (cssVar === undefined) {
    return undefined;
  }

  return resolveCssVar(system, cssVar, mode, seen);
}

// Chakra v3 splits semantic tokens with `{ _light, _dark }` values into one
// sub-token per condition, all sharing the same name. `tokenMap.get(name)`
// only retains the last one registered, so the original conditions map and
// the per-mode values aren't reachable from a single token lookup. The
// resolved per-mode values live in `tokens.cssVarMap`, keyed by condition and
// then by CSS variable name (e.g. `'--teleport-colors-terminal-foreground'`).
// Single-color themes (e.g. bblp) skip the conditional split entirely and
// store their values under the `'base'` condition.
function resolveCssVar(
  system: SystemContext,
  cssVar: string,
  mode: ColorMode,
  seen: Set<string>
): string | undefined {
  if (seen.has(cssVar)) {
    return undefined;
  }
  seen.add(cssVar);

  const { cssVarMap } = system.tokens;
  const value =
    cssVarMap.get(`_${mode}`)?.get(cssVar) ??
    cssVarMap.get('base')?.get(cssVar);

  if (typeof value !== 'string' || value === '') {
    return undefined;
  }

  return substituteReferences(system, value, mode, seen);
}

// Look up the CSS variable name (e.g. `--teleport-colors-brand`) for a Chakra
// token name (e.g. `colors.brand`). After Chakra's conditional split there's
// no guarantee `getByName` returns the base form, but every variant carries
// the same `extensions.cssVar`, so the first match is enough.
function lookupCssVar(system: SystemContext, tokenName: string) {
  return system.tokens.getByName(tokenName)?.extensions.cssVar?.var;
}

// Chakra writes references either as `{category.path.to.token}` (in tokens
// that reference other tokens whose own value is conditional and therefore
// can't be eagerly expanded) or as `var(--name)` (everything else, after the
// `tokens/conditionals` transform substitutes them). Replace both, so values
// like `color-mix(in srgb, white 50%, {colors.levels.sunken})` and
// `var(--teleport-colors-data-visualisation-primary-abbey)` both reduce to
// concrete colors. Each match gets its own copy of `seen` so siblings don't
// share a cycle check.
function substituteReferences(
  system: SystemContext,
  value: string,
  mode: ColorMode,
  seen: Set<string>
) {
  let result = '';
  let lastIndex = 0;

  for (const match of value.matchAll(/var\((--[a-z0-9-]+)\)|\{([^}]+)}/gi)) {
    // One of the two alternatives in the regex is always captured.
    const [, cssVarMatch, tokenNameMatch] = match;
    const resolved = cssVarMatch
      ? resolveCssVar(system, cssVarMatch, mode, new Set(seen))
      : resolveTokenValue(system, tokenNameMatch, mode, new Set(seen));

    if (resolved === undefined) {
      return undefined;
    }

    result += value.slice(lastIndex, match.index) + resolved;
    lastIndex = match.index + match[0].length;
  }

  return result + value.slice(lastIndex);
}
