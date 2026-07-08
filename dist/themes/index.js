import "./theme.js";
import { BBLP_THEME } from "./bblp/theme.js";
import "./bblp/index.js";
import { TELEPORT_THEME, system } from "./teleport/theme.js";
import "./teleport/index.js";
import { MC_THEME } from "./mc/theme.js";
import "./mc/index.js";
//#region src/themes/index.ts
const THEMES = [
	BBLP_THEME,
	MC_THEME,
	TELEPORT_THEME
];
globalThis.__system = system;
globalThis.__system = null;
//#endregion
export { THEMES };

//# sourceMappingURL=index.js.map