import { chakra } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
//#region src/components/typography/subtitle/Subtitle.tsx
const Subtitle = chakra("p", {
	variants: { 
	/**
	* The size of the subtitle.
	*/
size: {
		sm: { textStyle: "subtitle3" },
		md: { textStyle: "subtitle2" },
		lg: { textStyle: "subtitle1" }
	} },
	defaultVariants: { size: "md" }
});
const Subtitle1 = (props) => /* @__PURE__ */ jsx(Subtitle, {
	size: "lg",
	...props
});
const Subtitle2 = (props) => /* @__PURE__ */ jsx(Subtitle, {
	size: "md",
	...props
});
const Subtitle3 = (props) => /* @__PURE__ */ jsx(Subtitle, {
	size: "sm",
	...props
});
//#endregion
export { Subtitle, Subtitle1, Subtitle2, Subtitle3 };

//# sourceMappingURL=Subtitle.js.map