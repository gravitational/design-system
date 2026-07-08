import { Button } from "../../button/Button.js";
import "../../button/index.js";
import { jsx } from "react/jsx-runtime";
import { useFormState } from "react-hook-form";
//#region src/components/forms/submitButton/SubmitButton.tsx
function SubmitButton(props) {
	const state = useFormState();
	const disabled = props.disabled == true ? true : !state.isValid;
	return /* @__PURE__ */ jsx(Button, {
		type: "submit",
		loading: state.isSubmitting,
		...props,
		disabled
	});
}
//#endregion
export { SubmitButton };

//# sourceMappingURL=SubmitButton.js.map