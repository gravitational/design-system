import "../theme.js";
import { colors } from "./colors.js";
import { defineConfig } from "@chakra-ui/react";
const BBLP_THEME = {
	isCustom: true,
	mode: 0,
	color: "dark",
	name: "bblp",
	storybookName: "BBLP Theme",
	config: defineConfig({ theme: { semanticTokens: { colors } } })
};
//#endregion
export { BBLP_THEME };

//# sourceMappingURL=theme.js.map