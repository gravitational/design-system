import { useFieldComponents } from "./components.js";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "zod/v4/core";
//#region src/components/forms/useForm.ts
function useForm$1(props, schemaOrResolver) {
	const form = useForm({
		mode: "onChange",
		...props,
		resolver: schemaOrResolver ? typeof schemaOrResolver === "function" ? schemaOrResolver : zodResolver(schemaOrResolver) : void 0
	});
	const fieldComponents = useFieldComponents();
	return useMemo(() => ({
		...form,
		...fieldComponents
	}), [form, fieldComponents]);
}
//#endregion
export { useForm$1 as useForm };

//# sourceMappingURL=useForm.js.map