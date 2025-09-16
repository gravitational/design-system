import { GithubLogoIcon } from '../../src';
import { GitHubLink } from '../../src/storybook/components/GitHubLink';
import { useCurrentEntry } from './utils';

export function EditInGitHubLink() {
  const entry = useCurrentEntry();

  if (!entry) {
    return null;
  }

  const importPath = entry.importPath.startsWith('./')
    ? entry.importPath.slice(2)
    : entry.importPath;
  const githubUrl = `https://github.com/gravitational/design-system/blob/main/${importPath}`;

  return (
    <GitHubLink fontSize="sm" href={githubUrl} icon={GithubLogoIcon}>
      Edit this page on GitHub
    </GitHubLink>
  );
}
