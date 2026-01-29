import {
  EMPTY_STYLES,
  useRecipe,
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
} from '@chakra-ui/react';
import type { RefAttributes } from 'react';

import { CheckBoldIcon } from '../../../icons';
import { dataAttr } from '../../../utils/attr';

export interface CheckmarkProps
  extends HTMLChakraProps<'svg', RecipeProps<'checkmark'>>,
    UnstyledProp {
  /**
   * Whether the checkmark is checked
   */
  checked?: boolean | undefined;
  /**
   * Whether the checkmark is indeterminate
   */
  indeterminate?: boolean | undefined;
  /**
   * Whether the checkmark is disabled
   */
  disabled?: boolean | undefined;
}

export function Checkmark(
  props: CheckmarkProps & RefAttributes<SVGSVGElement>
) {
  const recipe = useRecipe({ key: 'checkmark', recipe: props.recipe });
  const [variantProps, restProps] = recipe.splitVariantProps(props);

  const { checked, indeterminate, disabled, unstyled, children, ...rest } =
    restProps;

  void children;

  const styles = unstyled ? EMPTY_STYLES : recipe(variantProps);

  return (
    <CheckBoldIcon
      data-state={
        indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'
      }
      data-disabled={dataAttr(disabled)}
      css={[styles, props.css]}
      {...rest}
    />
  );
}
