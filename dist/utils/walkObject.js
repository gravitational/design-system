//#region src/utils/walkObject.ts
const isObject = (v) => v != null && typeof v === "object" && !Array.isArray(v);
const isNotNullish = (element) => element != null;
function walkObject(target, predicate, options = {}) {
	const { stop, getKey } = options;
	function inner(value, path = []) {
		if (isObject(value) || Array.isArray(value)) {
			const result = {};
			for (const [prop, child] of Object.entries(value)) {
				const key = getKey?.(prop, child) ?? prop;
				const childPath = [...path, key];
				if (stop?.(value, childPath)) return predicate(value, path);
				const next = inner(child, childPath);
				if (isNotNullish(next)) result[key] = next;
			}
			return result;
		}
		return predicate(value, path);
	}
	return inner(target);
}
function mapObject(obj, fn) {
	if (Array.isArray(obj)) return obj.map((value) => isNotNullish(value) ? fn(value) : value);
	if (!isObject(obj)) return isNotNullish(obj) ? fn(obj) : obj;
	return walkObject(obj, (value) => fn(value));
}
//#endregion
export { mapObject };

//# sourceMappingURL=walkObject.js.map