import { alertSlotRecipe } from '../components/feedback/alert/recipe';
import { bannerSlotRecipe } from '../components/feedback/banner/recipe';
import { blockquoteSlotRecipe } from '../components/blockquote/recipe';
import { listSlotRecipe } from '../components/list/recipe';
import { dialogSlotRecipe } from '../components/overlays/dialog/recipe';
import { tableSlotRecipe } from '../components/table/recipe';
import { tooltipSlotRecipe } from '../components/tooltip/recipe';

export const slotRecipes = {
  alert: alertSlotRecipe,
  banner: bannerSlotRecipe,
  blockquote: blockquoteSlotRecipe,
  dialog: dialogSlotRecipe,
  list: listSlotRecipe,
  table: tableSlotRecipe,
  tooltip: tooltipSlotRecipe,
};
