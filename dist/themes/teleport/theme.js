import { resolveColorToken } from "../../theme/resolveColorToken.js";
import { createThemeSystem } from "../../theme/index.js";
import "../theme.js";
import { colors } from "./colors.js";
import { defineConfig } from "@chakra-ui/react";
//#region src/themes/teleport/theme.ts
const config = defineConfig({ theme: { semanticTokens: { colors } } });
const system = createThemeSystem(config);
const TELEPORT_THEME = {
	mode: 1,
	name: "teleport",
	config
};
/**
* Resolves a teleport color token to a CSS color string for the given color
* mode, substituting any embedded `{token.path}` references. Thin wrapper
* over {@link resolveColorToken} bound to the teleport system, for callers
* that can't rely on CSS custom properties (e.g. canvas/WebGL painting or
* the Electron main process).
*/
function resolveTeleportColor(tokenName, mode) {
	return resolveColorToken(system, tokenName, mode);
}
//#endregion
export { TELEPORT_THEME, resolveTeleportColor, system };

//# sourceMappingURL=theme.js.map