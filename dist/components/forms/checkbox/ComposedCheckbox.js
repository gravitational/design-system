import { CheckBoldIcon } from "../../../icons/generated/CheckIcon.js";
import { MinusBoldIcon } from "../../../icons/generated/MinusIcon.js";
import "../../../icons/index.js";
import { Checkbox } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/forms/checkbox/ComposedCheckbox.tsx
function ComposedCheckbox({ label, children, ...rest }) {
	return /* @__PURE__ */ jsxs(Checkbox.Root, {
		...rest,
		children: [
			/* @__PURE__ */ jsx(Checkbox.HiddenInput, {}),
			/* @__PURE__ */ jsx(Checkbox.Control, { children: /* @__PURE__ */ jsx(Checkbox.Indicator, {
				checked: /* @__PURE__ */ jsx(CheckBoldIcon, {}),
				indeterminate: /* @__PURE__ */ jsx(MinusBoldIcon, {})
			}) }),
			(label ?? children) != null && /* @__PURE__ */ jsx(Checkbox.Label, { children: label ?? children })
		]
	});
}
//#endregion
export { ComposedCheckbox };

//# sourceMappingURL=ComposedCheckbox.js.map