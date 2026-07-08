import { Group } from "../group/Group.js";
import { ButtonPropsProvider, useRecipe } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
import { useMemo } from "react";
//#region src/components/button/ButtonGroup.tsx
function ButtonGroup(props) {
	const recipe = useRecipe({ key: "button" });
	const [variantProps, otherProps] = useMemo(() => recipe.splitVariantProps(props), [props, recipe]);
	return /* @__PURE__ */ jsx(ButtonPropsProvider, {
		value: variantProps,
		children: /* @__PURE__ */ jsx(Group, { ...otherProps })
	});
}
//#endregion
export { ButtonGroup };

//# sourceMappingURL=ButtonGroup.js.map