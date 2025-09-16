import { Span } from '@chakra-ui/react';

import { ArrowUpRightIcon, GithubLogoIcon } from '../../icons';

interface GitHubFileLinkProps {
  to: string;
}

function getFileName(path: string) {
  if (path.includes('.')) {
    return path.split('/').pop();
  }

  return path;
}

export function GitHubFileLink({ to }: GitHubFileLinkProps) {
  const url = `https://github.com/gravitational/design-system/blob/main/${to}`;

  return (
    <Span
      asChild
      display="inline-flex"
      alignItems="center"
      gap={2}
      px={1}
      mx={1}
      fontSize="sm"
      fontFamily="mono"
      verticalAlign="middle"
      py={1}
      mt="-2px"
      lineHeight={1}
      border="1px solid {colors.interactive.tonal.neutral.1}"
      borderRadius="md"
      _hover={{ bg: 'interactive.tonal.neutral.1' }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        <GithubLogoIcon size="sm" color="text.slightlyMuted" />

        {getFileName(to)}

        <ArrowUpRightIcon ml="-1px" size="xs" color="text.slightlyMuted" />
      </a>
    </Span>
  );
}
