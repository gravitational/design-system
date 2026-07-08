import { ChakraProvider } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
import { ThemeProvider } from "next-themes";
//#region src/provider/ThemeProvider.tsx
function ThemeProvider$1({ system, ...rest }) {
	return /* @__PURE__ */ jsx(ChakraProvider, {
		value: system,
		children: /* @__PURE__ */ jsx(ThemeProvider, {
			attribute: "class",
			disableTransitionOnChange: true,
			...rest
		})
	});
}
//#endregion
export { ThemeProvider$1 as ThemeProvider };

//# sourceMappingURL=ThemeProvider.js.map