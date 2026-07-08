import { chakra, useRecipe } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
//#region src/components/feedback/shimmerBox/ShimmerBox.tsx
/**
* A loading skeleton box to be used as a placeholder for content being loaded.
*/
function ShimmerBox({ css, ...props }) {
	const styles = useRecipe({ key: "shimmerBox" })();
	return /* @__PURE__ */ jsx(chakra.div, {
		...props,
		css: [styles, css]
	});
}
//#endregion
export { ShimmerBox };

//# sourceMappingURL=ShimmerBox.js.map