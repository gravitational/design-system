import type { SystemContext } from '@chakra-ui/react';

export type ColorMode = 'light' | 'dark';

/**
 * Resolves a color token to a CSS color string for the given color mode,
 * recursively substituting any `{token.path}` references in the value.
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
  if (seen.has(tokenName)) {
    return undefined;
  }
  seen.add(tokenName);

  const token = system.tokens.getByName(tokenName);
  if (!token) {
    return undefined;
  }

  const raw = pickConditionValue(token.extensions.conditions, mode);
  // oxlint-disable-next-line typescript/no-unsafe-assignment
  const value = raw ?? token.originalValue;

  if (typeof value !== 'string') {
    return undefined;
  }

  return substituteReferences(system, value, mode, seen);
}

// Chakra types token conditions as `Dict = Record<string, any>`. For color
// tokens we only care about the mode-specific entries, so narrow to those.
interface ColorConditions {
  _light?: unknown;
  _dark?: unknown;
}

function pickConditionValue(
  conditions: ColorConditions | undefined,
  mode: ColorMode
) {
  const value = conditions?.[mode === 'dark' ? '_dark' : '_light'];

  return typeof value === 'string' ? value : undefined;
}

// Chakra writes token references as `{category.path.to.token}`. Replace every
// occurrence with its resolved value so references embedded inside CSS
// expressions (e.g. `color-mix(in srgb, white 50%, {colors.levels.sunken})`)
// get reduced as well. Siblings each get their own copy of `seen` so one
// branch's ancestors don't leak into another's cycle check.
function substituteReferences(
  system: SystemContext,
  value: string,
  mode: ColorMode,
  seen: Set<string>
) {
  let result = '';
  let lastIndex = 0;

  for (const match of value.matchAll(/\{([^}]+)}/g)) {
    const resolved = resolveTokenValue(system, match[1], mode, new Set(seen));
    if (resolved === undefined) {
      return undefined;
    }

    result += value.slice(lastIndex, match.index) + resolved;
    lastIndex = match.index + match[0].length;
  }

  return result + value.slice(lastIndex);
}
