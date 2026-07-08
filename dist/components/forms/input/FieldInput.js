import { Field as Field$1 } from "../field/field.js";
import "../field/index.js";
import { Input as Input$1 } from "./Input.js";
import { mergeRefs } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useController } from "react-hook-form";
//#region src/components/forms/input/FieldInput.tsx
function FieldInput({ helperText, name, label, required, ...rest }) {
	const { field, fieldState, formState: { isSubmitting } } = useController({ name });
	const mergedRef = mergeRefs(rest.ref, field.ref);
	return /* @__PURE__ */ jsxs(Field$1.Root, {
		invalid: fieldState.invalid,
		required,
		children: [
			label && /* @__PURE__ */ jsxs(Field$1.Label, { children: [
				label,
				" ",
				required && /* @__PURE__ */ jsx(Field$1.RequiredIndicator, {})
			] }),
			/* @__PURE__ */ jsx(Input$1, {
				disabled: isSubmitting,
				hasError: fieldState.invalid,
				...rest,
				...field,
				ref: mergedRef,
				value: field.value ?? ""
			}),
			/* @__PURE__ */ jsx(Field$1.ErrorText, { children: fieldState.error?.message }),
			helperText && !fieldState.error && /* @__PURE__ */ jsx(Field$1.HelperText, { children: helperText })
		]
	});
}
function FieldInputPassword(props) {
	return /* @__PURE__ */ jsx(FieldInput, {
		placeholder: "Password",
		...props,
		type: "password"
	});
}
//#endregion
export { FieldInput, FieldInputPassword };

//# sourceMappingURL=FieldInput.js.map