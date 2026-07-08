//#region src/theme/resolveColorToken.ts
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
function resolveColorToken(system, tokenName, mode) {
	return resolveTokenValue(system, tokenName, mode);
}
function resolveTokenValue(system, tokenName, mode, seen = /* @__PURE__ */ new Set()) {
	const cssVar = lookupCssVar(system, tokenName);
	if (cssVar === void 0) return;
	return resolveCssVar(system, cssVar, mode, seen);
}
function resolveCssVar(system, cssVar, mode, seen) {
	if (seen.has(cssVar)) return;
	seen.add(cssVar);
	const { cssVarMap } = system.tokens;
	const value = cssVarMap.get(`_${mode}`)?.get(cssVar) ?? cssVarMap.get("base")?.get(cssVar);
	if (typeof value !== "string" || value === "") return;
	return substituteReferences(system, value, mode, seen);
}
function lookupCssVar(system, tokenName) {
	return system.tokens.getByName(tokenName)?.extensions.cssVar?.var;
}
function substituteReferences(system, value, mode, seen) {
	let result = "";
	let lastIndex = 0;
	for (const match of value.matchAll(/var\((--[a-z0-9-]+)\)|\{([^}]+)}/gi)) {
		const [, cssVarMatch, tokenNameMatch] = match;
		const resolved = cssVarMatch ? resolveCssVar(system, cssVarMatch, mode, new Set(seen)) : resolveTokenValue(system, tokenNameMatch, mode, new Set(seen));
		if (resolved === void 0) return;
		result += value.slice(lastIndex, match.index) + resolved;
		lastIndex = match.index + match[0].length;
	}
	return result + value.slice(lastIndex);
}
//#endregion
export { resolveColorToken };

//# sourceMappingURL=resolveColorToken.js.map