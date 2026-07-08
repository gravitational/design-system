import { chakra } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
//#region src/components/layout/flex/Flex.tsx
function Flex$1(props) {
	const { direction, align, justify, wrap, basis, grow, shrink, inline, ...rest } = props;
	return /* @__PURE__ */ jsx(chakra.div, {
		...rest,
		css: {
			display: inline ? "inline-flex" : "flex",
			flexDirection: direction,
			alignItems: align,
			justifyContent: justify,
			flexWrap: wrap,
			flexBasis: basis,
			flexGrow: grow,
			flexShrink: shrink,
			...props.css
		}
	});
}
//#endregion
export { Flex$1 as Flex };

//# sourceMappingURL=Flex.js.map