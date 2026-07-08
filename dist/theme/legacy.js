//#region src/theme/legacy.ts
function toKebabCase(str) {
	return str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
function hasValueProperty(obj) {
	return obj !== null && typeof obj === "object" && "value" in obj;
}
/**
* Maps a generated CSS variable reference (e.g.
* `"var(--teleport-colors-terminal-foreground)"`) back to its Chakra token
* name (e.g. `"colors.terminal.foreground"`). Populated as a side effect of
* {@link tokensToCSSVariables}, so it stays consistent with whatever the
* legacy var-string structure currently exposes. Shared across themes — they
* all walk structurally identical source trees and therefore produce the same
* mappings.
*
* Lets `resolveColorTokens` accept the existing var-string subtrees (such as
* `theme.colors.terminal`) without callers having to maintain a parallel
* list of token paths.
*/
const cssVarToTokenPath = /* @__PURE__ */ new Map();
function tokensToCSSVariables(obj) {
	function processNode(node, path) {
		if (hasValueProperty(node)) {
			const cssVar = `var(--${[...path].map(toKebabCase).join("-")})`;
			cssVarToTokenPath.set(cssVar, path.slice(1).join("."));
			return cssVar;
		}
		if (!node || typeof node !== "object") return node;
		const nodeAsRecord = node;
		const result = {};
		for (const key in nodeAsRecord) if (Object.prototype.hasOwnProperty.call(nodeAsRecord, key)) {
			const newPath = [...path, key];
			result[key] = processNode(nodeAsRecord[key], newPath);
		}
		return result;
	}
	return processNode(obj, ["teleport", "colors"]);
}
//#endregion
export { cssVarToTokenPath, tokensToCSSVariables };

//# sourceMappingURL=legacy.js.map