import { chakra, type BoxProps, type IconProps } from '@chakra-ui/react';
import type { ComponentType, PropsWithChildren } from 'react';

import { ArrowUpRightIcon } from '../../icons';

const Link = chakra('div', {
  base: {
    display: 'inline-flex',
    gap: 2,
    alignItems: 'center',
    color: 'text.slightlyMuted',
    _hover: {
      textDecoration: 'underline',
    },
  },
});

interface GitHubLinkProps extends BoxProps {
  href: string;
  icon: ComponentType<IconProps>;
}

export function GitHubLink({
  href,
  icon: Icon,
  children,
  ...rest
}: PropsWithChildren<GitHubLinkProps>) {
  return (
    <Link asChild {...rest}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Icon size="sm" />

        {children}

        <ArrowUpRightIcon ml="-1px" size="xs" />
      </a>
    </Link>
  );
}
