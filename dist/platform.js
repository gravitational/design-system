//#region src/platform.ts
/**
* getPlatform returns the platform of the user based on the browser user agent or the Node.js
* binary.
*
* getPlatform must work in both environments. It must be defined within the design package and not
* the shared package to avoid circular dependencies – the design package needs to be able to detect
* the platform and the shared package depends on the design package.
*/
function getPlatform() {
	if (typeof window !== "undefined") {
		const userAgent = window.navigator.userAgent;
		if (userAgent.includes("Windows")) return "Windows";
		if (userAgent.includes("Macintosh")) return "macOS";
		return "Linux";
	}
	if (typeof process !== "undefined") switch (process.platform) {
		case "win32": return "Windows";
		case "darwin": return "macOS";
		default: return "Linux";
	}
	throw new Error("Expected either window or process to be defined");
}
//#endregion
export { getPlatform };

//# sourceMappingURL=platform.js.map