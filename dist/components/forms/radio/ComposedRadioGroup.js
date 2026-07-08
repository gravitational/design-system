import { RadioGroup } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/forms/radio/ComposedRadioGroup.tsx
function ComposedRadioGroup({ label, options, children, ...rest }) {
	return /* @__PURE__ */ jsxs(RadioGroup.Root, {
		...rest,
		children: [
			label && /* @__PURE__ */ jsx(RadioGroup.Label, { children: label }),
			options?.map((option) => /* @__PURE__ */ jsxs(RadioGroup.Item, {
				value: option.value,
				disabled: option.disabled,
				children: [
					/* @__PURE__ */ jsx(RadioGroup.ItemHiddenInput, {}),
					/* @__PURE__ */ jsx(RadioGroup.ItemIndicator, {}),
					option.label != null && /* @__PURE__ */ jsx(RadioGroup.ItemText, { children: option.label })
				]
			}, option.value)),
			children
		]
	});
}
//#endregion
export { ComposedRadioGroup };

//# sourceMappingURL=ComposedRadioGroup.js.map