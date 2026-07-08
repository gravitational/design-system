import { Field } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/forms/field/ComposedField.tsx
function ComposedField({ label, helperText, errorMessage, required, children, ...rest }) {
	return /* @__PURE__ */ jsxs(Field.Root, {
		required,
		...rest,
		children: [
			label && /* @__PURE__ */ jsxs(Field.Label, { children: [label, required && /* @__PURE__ */ jsx(Field.RequiredIndicator, {})] }),
			children,
			errorMessage && /* @__PURE__ */ jsx(Field.ErrorText, { children: errorMessage }),
			helperText && !errorMessage && /* @__PURE__ */ jsx(Field.HelperText, { children: helperText })
		]
	});
}
//#endregion
export { ComposedField };

//# sourceMappingURL=ComposedField.js.map