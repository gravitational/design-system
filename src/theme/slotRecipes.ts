import { alertSlotRecipe } from '../components/feedback/alert/recipe';
import { bannerSlotRecipe } from '../components/feedback/banner/recipe';
import { blockquoteSlotRecipe } from '../components/blockquote/recipe';
import { datePickerSlotRecipe } from '../components/forms/datePicker/recipe';
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
  datePicker: datePickerSlotRecipe,
  list: listSlotRecipe,
  popover: popoverSlotRecipe,
  table: tableSlotRecipe,
  tooltip: tooltipSlotRecipe,
};
