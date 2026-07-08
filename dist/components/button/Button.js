import { Button } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
//#region src/components/button/Button.tsx
function ButtonSecondary(props) {
	return /* @__PURE__ */ jsx(Button, {
		fill: "filled",
		intent: "neutral",
		...props
	});
}
function ButtonBorder(props) {
	return /* @__PURE__ */ jsx(Button, {
		fill: "border",
		intent: "neutral",
		...props
	});
}
function ButtonWarning(props) {
	return /* @__PURE__ */ jsx(Button, {
		fill: "filled",
		intent: "danger",
		...props
	});
}
function ButtonWarningBorder(props) {
	return /* @__PURE__ */ jsx(Button, {
		fill: "border",
		intent: "danger",
		...props
	});
}
function ButtonText(props) {
	return /* @__PURE__ */ jsx(Button, {
		fill: "minimal",
		intent: "neutral",
		...props
	});
}
function ButtonLink({ ref, ...props }) {
	return /* @__PURE__ */ jsx(Button, {
		as: "a",
		fill: "link",
		intent: "neutral",
		ref,
		...props
	});
}
//#endregion
export { Button, ButtonBorder, ButtonLink, ButtonSecondary, ButtonText, ButtonWarning, ButtonWarningBorder };

//# sourceMappingURL=Button.js.map