import {
  ButtonPropsProvider,
  useRecipe,
  type RecipeProps,
} from '@chakra-ui/react';
import { useMemo, type RefAttributes } from 'react';

import { Group, type GroupProps } from '../group/Group';

export type ButtonGroupProps = Omit<GroupProps, 'fill'> & RecipeProps<'button'>;

export function ButtonGroup(
  props: ButtonGroupProps & RefAttributes<HTMLDivElement>
) {
  const recipe = useRecipe({ key: 'button' });
  const [variantProps, otherProps] = useMemo(
    () => recipe.splitVariantProps(props),
    [props, recipe]
  );

  return (
    <ButtonPropsProvider value={variantProps}>
      <Group {...otherProps} />
    </ButtonPropsProvider>
  );
}
