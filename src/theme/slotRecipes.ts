import { alertSlotRecipe } from '../components/feedback/alert/recipe';
import { bannerSlotRecipe } from '../components/feedback/banner/recipe';
import { blockquoteSlotRecipe } from '../components/blockquote/recipe';
import { checkboxSlotRecipe } from '../components/forms/checkbox/recipe';
import { fieldSlotRecipe } from '../components/forms/field/recipe';
import { radioGroupSlotRecipe } from '../components/forms/radio/recipe';
import { toggleSlotRecipe } from '../components/forms/toggle/recipe';
import { listSlotRecipe } from '../components/list/recipe';
import { dialogSlotRecipe } from '../components/overlays/dialog/recipe';
import { popoverSlotRecipe } from '../components/overlays/popover/recipe';
import { tableSlotRecipe } from '../components/table/recipe';
import { tooltipSlotRecipe } from '../components/overlays/tooltip/recipe';

export const slotRecipes = {
  alert: alertSlotRecipe,
  banner: bannerSlotRecipe,
  blockquote: blockquoteSlotRecipe,
  dialog: dialogSlotRecipe,
  list: listSlotRecipe,
  popover: popoverSlotRecipe,
  checkbox: checkboxSlotRecipe,
  field: fieldSlotRecipe,
  radioGroup: radioGroupSlotRecipe,
  switch: toggleSlotRecipe,
  table: tableSlotRecipe,
  tooltip: tooltipSlotRecipe,
};
