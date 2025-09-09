import { BBLP_THEME } from './bblp';
import { MC_THEME } from './mc';
import { system, TELEPORT_THEME } from './teleport';

export const THEMES = [BBLP_THEME, MC_THEME, TELEPORT_THEME];

export { BBLP_THEME, MC_THEME, TELEPORT_THEME };

// This is nonsense, but rollup will remove the `system` export from the Teleport theme if
// it is not exported or doesn't modify the global state. We need `system` to be exported
// for the code generation of the theme, but want to avoid exporting it into the actual
// package.
// @ts-expect-error TS(18048) -- Ignore "The left-hand side of an assignment expression must be a variable or a property access."
globalThis.__system = system;
// @ts-expect-error TS(18048) -- Ignore "The left-hand side of an assignment expression must be a variable or a property access."
globalThis.__system = null;

export { UiThemeMode } from './theme';
