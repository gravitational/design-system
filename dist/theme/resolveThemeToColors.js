//#region src/theme/resolveThemeToColors.ts
function resolveThemeToColors(theme) {
	const styles = getComputedStyle(document.documentElement);
	const resolveValue = (value) => {
		if (typeof value === "string") {
			const varMatch = /^var\((--[a-zA-Z0-9-_]+)\)$/.exec(value);
			return varMatch ? styles.getPropertyValue(varMatch[1]).trim() : value;
		}
		if (Array.isArray(value)) return value.map((v) => {
			const varMatch = /^var\((--[a-zA-Z0-9-_]+)\)$/.exec(v);
			if (!varMatch) return v;
			return styles.getPropertyValue(varMatch[1]).trim();
		});
		const resolved = {};
		for (const [key, val] of Object.entries(value)) resolved[key] = resolveValue(val);
		return resolved;
	};
	return resolveValue(theme);
}
//#endregion
export { resolveThemeToColors };

//# sourceMappingURL=resolveThemeToColors.js.map