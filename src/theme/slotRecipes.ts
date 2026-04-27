import { blockquoteSlotRecipe } from '../components/blockquote/recipe';
import { listSlotRecipe } from '../components/list/recipe';
import { menuSlotRecipe } from '../components/overlays/menu/recipe';
import { tableSlotRecipe } from '../components/table/recipe';
import { tooltipSlotRecipe } from '../components/tooltip/recipe';

export const slotRecipes = {
  blockquote: blockquoteSlotRecipe,
  list: listSlotRecipe,
  menu: menuSlotRecipe,
  table: tableSlotRecipe,
  tooltip: tooltipSlotRecipe,
};
