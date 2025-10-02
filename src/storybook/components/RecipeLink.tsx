import type { BoxProps } from '@chakra-ui/react';

import { ChefHatIcon } from '../../icons';
import { GitHubLink } from './GitHubLink';

interface RecipeLinkProps extends BoxProps {
  recipePath: string;
  text?: string;
}

export function RecipeLink({ recipePath, text, ...rest }: RecipeLinkProps) {
  return (
    <GitHubLink
      href={`https://github.com/gravitational/design-system/blob/main/${recipePath}`}
      icon={ChefHatIcon}
      {...rest}
    >
      {text ?? 'Recipe'}
    </GitHubLink>
  );
}
