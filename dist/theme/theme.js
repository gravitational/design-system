import { animationStyles } from "./animationStyles.js";
import { breakpoints } from "./breakpoints.js";
import { globalCss } from "./globalCss.js";
import { keyframes } from "./keyframes.js";
import { layerStyles } from "./layerStyles.js";
import { recipes } from "./recipes.js";
import { semanticTokens } from "./semanticTokens/index.js";
import { slotRecipes } from "./slotRecipes.js";
import { textStyles } from "./textStyles.js";
import { tokens } from "./tokens/index.js";
import { createSystem, defaultBaseConfig, defineConfig } from "@chakra-ui/react";
//#region src/theme/theme.ts
const baseThemeConfig = defineConfig({
	preflight: true,
	cssVarsPrefix: "teleport",
	cssVarsRoot: ":where(:root, :host)",
	globalCss,
	conditions: { hasIcon: "&[data-has-icon]" },
	theme: {
		breakpoints,
		keyframes,
		tokens,
		semanticTokens,
		recipes,
		slotRecipes,
		textStyles,
		layerStyles,
		animationStyles
	}
});
createSystem(defaultBaseConfig, baseThemeConfig);
//#endregion
export { baseThemeConfig };

//# sourceMappingURL=theme.js.map