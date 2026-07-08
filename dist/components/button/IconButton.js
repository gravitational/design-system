import { chakra, useRecipe } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
//#region src/components/button/IconButton.tsx
/**
* A button with an icon.
*/
function IconButton$1({ css, type = "button", ...props }) {
	const recipe = useRecipe({ key: "iconButton" });
	const [recipeProps, rest] = recipe.splitVariantProps(props);
	const styles = recipe(recipeProps);
	return /* @__PURE__ */ jsx(chakra.button, {
		type,
		...rest,
		css: [styles, css]
	});
}
//#endregion
export { IconButton$1 as IconButton };

//# sourceMappingURL=IconButton.js.map