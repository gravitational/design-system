import { Heading, Heading as Heading$1 } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
//#region src/components/typography/heading/Heading.tsx
const H1 = (props) => /* @__PURE__ */ jsx(Heading, {
	as: "h1",
	size: "lg",
	...props
});
const H2 = (props) => /* @__PURE__ */ jsx(Heading, {
	as: "h2",
	size: "md",
	...props
});
const H3 = (props) => /* @__PURE__ */ jsx(Heading, {
	as: "h3",
	size: "sm",
	...props
});
const H4 = (props) => /* @__PURE__ */ jsx(Heading, {
	as: "h4",
	size: "xs",
	...props
});
//#endregion
export { H1, H2, H3, H4, Heading$1 as Heading };

//# sourceMappingURL=Heading.js.map