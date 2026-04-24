import type { SystemContext } from '@chakra-ui/react';

export type ColorMode = 'light' | 'dark';

/**
 * Resolves a color token to its literal value for the given color mode,
 * following any `{token.path}` references through to a primitive.
 *
 * For callers that can't rely on the document's CSS custom properties being
 * applied — e.g. Electron's `BrowserWindow.backgroundColor`, canvas/WebGL
 * painting, or any code running in the main process — where a final hex
 * string is required.
 *
 * Returns `undefined` if the token doesn't exist, has no value for the
 * requested mode, or resolves to a non-string (e.g. `color-mix(...)` or a
 * reference that can't be followed).
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
) {
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

  const referenced = matchTokenReference(value);
  if (referenced) {
    return resolveTokenValue(system, referenced, mode, seen);
  }

  return value;
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

// Chakra writes token references as `{category.path.to.token}`. Reject values
// that only contain a reference as part of a larger expression (e.g.
// `color-mix(in srgb, white 50%, {colors.levels.sunken})`); those can't be
// reduced to a single hex without evaluating the CSS function.
function matchTokenReference(value: string) {
  const match = /^\{([^}]+)}$/.exec(value.trim());

  return match ? match[1] : undefined;
}
