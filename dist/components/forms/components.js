import { FieldInput, FieldInputPassword } from "./input/FieldInput.js";
import "./input/index.js";
import { useMemo } from "react";
//#region src/components/forms/components.ts
function useFieldComponents() {
	return useMemo(() => createFieldComponents(), []);
}
function createFieldComponents() {
	return {
		FieldInput,
		FieldInputPassword
	};
}
//#endregion
export { useFieldComponents };

//# sourceMappingURL=components.js.map