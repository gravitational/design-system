import { defineRecipe } from "@chakra-ui/react";
//#region src/components/typography/heading/recipe.ts
const headingRecipe = defineRecipe({
	className: "teleport-heading",
	variants: { 
	/**
	* The size of the heading.
	*/
size: {
		xs: { textStyle: "h4" },
		sm: { textStyle: "h3" },
		md: { textStyle: "h2" },
		lg: { textStyle: "h1" }
	} },
	defaultVariants: { size: "md" }
});
//#endregion
export { headingRecipe };

//# sourceMappingURL=recipe.js.map