import {
  chakra,
  useRecipe,
  type HTMLChakraProps,
  type RecipeProps,
} from '@chakra-ui/react';
import type { RefAttributes } from 'react';

export type ShimmerBoxProps = HTMLChakraProps<'div', RecipeProps<'shimmerBox'>>;

/**
 * A loading skeleton box to be used as a placeholder for content being loaded.
 */
export function ShimmerBox(
  props: ShimmerBoxProps & RefAttributes<HTMLDivElement>
) {
  const recipe = useRecipe({ key: 'shimmerBox' });
  const styles = recipe();
  return <chakra.div css={[styles, props.css]} {...props} />;
}
