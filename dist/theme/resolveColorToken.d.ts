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
export declare function resolveColorToken(system: SystemContext, tokenName: string, mode: ColorMode): string | undefined;
