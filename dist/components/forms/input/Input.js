import { WarningCircleIcon } from "../../../icons/generated/WarningCircleIcon.js";
import "../../../icons/index.js";
import { Input, chakra } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/forms/input/Input.tsx
const ICON_SIZE = {
	sm: "16px",
	md: "18px",
	lg: "20px"
};
function Input$1({ icon: IconComponent, hasError, size = "md", disabled, ...rest }) {
	if (!IconComponent && !hasError) return /* @__PURE__ */ jsx(Input, {
		size,
		disabled,
		"aria-invalid": hasError,
		...rest
	});
	const iconSize = ICON_SIZE[size];
	return /* @__PURE__ */ jsxs(chakra.div, {
		display: "inline-flex",
		position: "relative",
		verticalAlign: "middle",
		children: [
			IconComponent && /* @__PURE__ */ jsx(chakra.span, {
				position: "absolute",
				insetStart: "17px",
				top: 0,
				bottom: 0,
				display: "flex",
				alignItems: "center",
				pointerEvents: "none",
				color: disabled ? "text.disabled" : "text.slightlyMuted",
				children: /* @__PURE__ */ jsx(IconComponent, {
					role: "graphics-symbol",
					boxSize: iconSize
				})
			}),
			/* @__PURE__ */ jsx(Input, {
				size,
				disabled,
				"aria-invalid": hasError,
				"data-has-icon": IconComponent ? "" : void 0,
				...rest
			}),
			hasError && /* @__PURE__ */ jsx(chakra.span, {
				position: "absolute",
				insetEnd: "9px",
				top: 0,
				bottom: 0,
				display: "flex",
				alignItems: "center",
				pointerEvents: "none",
				color: "interactive.solid.danger.default",
				"aria-label": "Error",
				role: "graphics-symbol",
				children: /* @__PURE__ */ jsx(WarningCircleIcon, { boxSize: iconSize })
			})
		]
	});
}
//#endregion
export { Input$1 as Input };

//# sourceMappingURL=Input.js.map