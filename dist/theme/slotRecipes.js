import { alertSlotRecipe } from "../components/feedback/alert/recipe.js";
import { bannerSlotRecipe } from "../components/feedback/banner/recipe.js";
import { blockquoteSlotRecipe } from "../components/blockquote/recipe.js";
import { checkboxSlotRecipe } from "../components/forms/checkbox/recipe.js";
import { datePickerSlotRecipe } from "../components/forms/datePicker/recipe.js";
import { fieldSlotRecipe } from "../components/forms/field/recipe.js";
import { radioGroupSlotRecipe } from "../components/forms/radio/recipe.js";
import { toggleSlotRecipe } from "../components/forms/toggle/recipe.js";
import { cardSlotRecipe } from "../components/layout/card/recipe.js";
import { listSlotRecipe } from "../components/list/recipe.js";
import { dialogSlotRecipe } from "../components/overlays/dialog/recipe.js";
import { menuSlotRecipe } from "../components/overlays/menu/recipe.js";
import { popoverSlotRecipe } from "../components/overlays/popover/recipe.js";
import { tableSlotRecipe } from "../components/table/recipe.js";
import { tooltipSlotRecipe } from "../components/overlays/tooltip/recipe.js";
//#region src/theme/slotRecipes.ts
const slotRecipes = {
	alert: alertSlotRecipe,
	banner: bannerSlotRecipe,
	blockquote: blockquoteSlotRecipe,
	card: cardSlotRecipe,
	dialog: dialogSlotRecipe,
	datePicker: datePickerSlotRecipe,
	list: listSlotRecipe,
	menu: menuSlotRecipe,
	popover: popoverSlotRecipe,
	checkbox: checkboxSlotRecipe,
	field: fieldSlotRecipe,
	radioGroup: radioGroupSlotRecipe,
	switch: toggleSlotRecipe,
	table: tableSlotRecipe,
	tooltip: tooltipSlotRecipe
};
//#endregion
export { slotRecipes };

//# sourceMappingURL=slotRecipes.js.map