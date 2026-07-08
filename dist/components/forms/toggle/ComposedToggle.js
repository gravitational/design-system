import { Switch } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/forms/toggle/ComposedToggle.tsx
function ComposedToggle({ isToggled, onToggle, label, disabled, ...rest }) {
	return /* @__PURE__ */ jsxs(Switch.Root, {
		checked: isToggled,
		onCheckedChange: onToggle,
		disabled,
		...rest,
		children: [
			/* @__PURE__ */ jsx(Switch.HiddenInput, { "data-testid": "toggle" }),
			/* @__PURE__ */ jsx(Switch.Control, { children: /* @__PURE__ */ jsx(Switch.Thumb, {}) }),
			label != null && /* @__PURE__ */ jsx(Switch.Label, { children: label })
		]
	});
}
//#endregion
export { ComposedToggle };

//# sourceMappingURL=ComposedToggle.js.map