import { XIcon } from "../../icons/generated/XIcon.js";
import "../../icons/index.js";
import { IconButton } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
//#region src/components/button/CloseButton.tsx
function CloseButton({ children, ...rest }) {
	return /* @__PURE__ */ jsx(IconButton, {
		"aria-label": "Close",
		fill: "minimal",
		intent: "neutral",
		...rest,
		children: children ?? /* @__PURE__ */ jsx(XIcon, {})
	});
}
//#endregion
export { CloseButton };

//# sourceMappingURL=CloseButton.js.map