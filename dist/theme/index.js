import { baseThemeConfig } from "./theme.js";
import "./legacy.js";
import "./resolveColorToken.js";
import "./resolveColorTokens.js";
import "./resolveThemeToColors.js";
import { createSystem, defaultBaseConfig } from "@chakra-ui/react";
//#region src/theme/index.ts
function createThemeSystem(...configs) {
	return createSystem(defaultBaseConfig, baseThemeConfig, ...configs);
}
//#endregion
export { createThemeSystem };

//# sourceMappingURL=index.js.map