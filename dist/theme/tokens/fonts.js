import { getPlatform } from "../../platform.js";
import { defineTokens } from "@chakra-ui/react";
//#region src/theme/tokens/fonts.ts
const fontMonoLinux = `"Droid Sans Mono", "monospace", monospace, "Droid Sans Fallback"`;
const fontMonoWin = `Consolas, "Courier New", monospace`;
const fontMonoMac = `Menlo, Monaco, "Courier New", monospace`;
function getMonoFont() {
	switch (getPlatform()) {
		case "Linux": return fontMonoLinux;
		case "macOS": return fontMonoMac;
		case "Windows": return fontMonoWin;
		default: return fontMonoLinux;
	}
}
const fonts = defineTokens.fonts({
	heading: { value: "Ubuntu2, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"" },
	body: { value: "Ubuntu2, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"" },
	mono: { value: getMonoFont() }
});
//#endregion
export { fonts };

//# sourceMappingURL=fonts.js.map