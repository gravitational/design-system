import {
  chakra,
  useRecipe,
  type HTMLChakraProps,
  type RecipeProps,
} from '@chakra-ui/react';
import type { RefAttributes } from 'react';

export type IconButtonProps = HTMLChakraProps<
  'button',
  RecipeProps<'iconButton'>
>;

/**
 * A button with an icon.
 */
export function IconButton({
  css,
  type = 'button',
  ...props
}: IconButtonProps & RefAttributes<HTMLButtonElement>) {
  const recipe = useRecipe({ key: 'iconButton' });
  const [recipeProps, rest] = recipe.splitVariantProps(props);
  const styles = recipe(recipeProps);
  return <chakra.button type={type} {...rest} css={[styles, css]} />;
}
