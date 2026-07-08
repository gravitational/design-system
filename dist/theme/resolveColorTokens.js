import { cssVarToTokenPath } from "./legacy.js";
import { resolveColorToken } from "./resolveColorToken.js";
//#region src/theme/resolveColorTokens.ts
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
function resolveColorTokens(system, tokens, mode) {
	if (typeof tokens === "string") return resolveColorToken(system, cssVarToTokenPath.get(tokens) ?? tokens, mode);
	const resolved = {};
	for (const [key, value] of Object.entries(tokens)) resolved[key] = resolveColorTokens(system, value, mode);
	return resolved;
}
//#endregion
export { resolveColorTokens };

//# sourceMappingURL=resolveColorTokens.js.map