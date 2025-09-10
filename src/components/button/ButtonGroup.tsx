import {
  ButtonPropsProvider,
  useRecipe,
  type RecipeProps,
} from '@chakra-ui/react';
import { useMemo, type Ref } from 'react';

import { Group, type GroupProps } from '../group/Group';

export interface ButtonGroupProps
  extends Omit<GroupProps, 'fill'>,
    RecipeProps<'button'> {
  ref?: Ref<HTMLElement>;
}

export function ButtonGroup(props: ButtonGroupProps) {
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
