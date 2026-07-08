import { buttonRecipe } from "../components/button/recipe.js";
import { iconButtonRecipe } from "../components/button/IconButton.recipe.js";
import { codeRecipe } from "../components/code/recipe.js";
import { containerRecipe } from "../components/container/recipe.js";
import { inputRecipe } from "../components/forms/input/recipe.js";
import { groupRecipe } from "../components/group/recipe.js";
import { shimmerBoxRecipe } from "../components/feedback/shimmerBox/recipe.js";
import { iconRecipe } from "../components/icon/recipe.js";
import { linkRecipe } from "../components/link/recipe.js";
import { spinnerRecipe } from "../components/spinner/recipe.js";
import { headingRecipe } from "../components/typography/heading/recipe.js";
//#region src/theme/recipes.ts
const recipes = {
	button: buttonRecipe,
	code: codeRecipe,
	container: containerRecipe,
	group: groupRecipe,
	heading: headingRecipe,
	icon: iconRecipe,
	iconButton: iconButtonRecipe,
	input: inputRecipe,
	link: linkRecipe,
	shimmerBox: shimmerBoxRecipe,
	spinner: spinnerRecipe
};
//#endregion
export { recipes };

//# sourceMappingURL=recipes.js.map