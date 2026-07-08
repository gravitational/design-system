import "../useForm.js";
import { chakra } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
import { useCallback } from "react";
import { FormProvider } from "react-hook-form";
//#region src/components/forms/form/Form.tsx
function Form({ children, form, onSubmit, ...rest }) {
	const handleSubmit = useCallback((event) => {
		if (!onSubmit) return;
		form.handleSubmit(onSubmit)(event);
	}, [form, onSubmit]);
	return /* @__PURE__ */ jsx(FormProvider, {
		...form,
		children: /* @__PURE__ */ jsx(chakra.form, {
			...rest,
			onSubmit: handleSubmit,
			children
		})
	});
}
//#endregion
export { Form };

//# sourceMappingURL=Form.js.map