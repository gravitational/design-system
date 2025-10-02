import { Box, Heading, HStack, Text } from '@chakra-ui/react';

import { GithubLogoIcon } from '../../icons';
import { GitHubLink } from './GitHubLink';
import { RecipeLink } from './RecipeLink';

interface DocsHeaderProps {
  title: string;
  description?: string;
  sourcePath?: string;
  recipePath?: string;
}

export function DocsHeader({
  description,
  title,
  sourcePath,
  recipePath,
}: DocsHeaderProps) {
  return (
    <Box>
      <Heading as="h1" mt={3} mb={4} size="3xl">
        {title}
      </Heading>

      {description && <Text mb={3}>{description}</Text>}

      {sourcePath || recipePath ? (
        <HStack mb={6} gap={6}>
          {sourcePath && (
            <GitHubLink
              href={`https://github.com/gravitational/design-system/blob/main/${sourcePath}`}
              icon={GithubLogoIcon}
            >
              Source
            </GitHubLink>
          )}

          {recipePath && <RecipeLink recipePath={recipePath} />}
        </HStack>
      ) : null}
    </Box>
  );
}
