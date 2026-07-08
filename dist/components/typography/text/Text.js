import { Text, Text as Text$1, chakra } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
//#region src/components/typography/text/Text.tsx
const P1 = (props) => /* @__PURE__ */ jsx(Text, {
	as: "p",
	textStyle: "body1",
	...props
});
const P2 = (props) => /* @__PURE__ */ jsx(Text, {
	as: "p",
	textStyle: "body2",
	...props
});
const P3 = (props) => /* @__PURE__ */ jsx(Text, {
	as: "p",
	textStyle: "body3",
	...props
});
const Caption = chakra("p", { base: { textStyle: "caption" } });
const Overline = chakra("p", { base: { textStyle: "overline" } });
//#endregion
export { Caption, Overline, P1, P2, P3, Text$1 as Text };

//# sourceMappingURL=Text.js.map