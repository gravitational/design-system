import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { getPackages, type Package } from '@manypkg/get-packages';
import { Octokit } from '@octokit/rest';
import { command, option, string } from 'cmd-ts';
import { toString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

import { createOctokit } from '../../util';

const BumpLevels = {
  dep: 0,
  patch: 1,
  minor: 2,
  major: 3,
} as const;

export const releaseCommand = command({
  name: 'release',
  args: {
    owner: option({
      type: string,
      long: 'owner',
      short: 'o',
      description: 'Repository owner',
    }),
    repo: option({
      type: string,
      long: 'repo',
      short: 'r',
      description: 'Repository name',
    }),
    packageName: option({
      type: string,
      long: 'package-name',
      short: 'p',
      description: 'Package name to release',
    }),
    version: option({
      type: string,
      long: 'version',
      short: 'v',
      description: 'Package version to release',
    }),
  },
  handler: async ({ owner, repo, packageName, version }) => {
    const octokit = createOctokit();

    await runReleaseCommand(octokit, owner, repo, packageName, version);
  },
});

async function runReleaseCommand(
  octokit: Octokit,
  owner: string,
  repo: string,
  packageName: string,
  version: string
) {
  const packages = await getPackages(process.cwd());

  const pkg: Package | undefined = packages.packages.find(
    p => p.packageJson.name === packageName
  );

  if (!pkg) {
    throw new Error(`Package ${packageName} not found`);
  }

  const pkgName = pkg.packageJson.name;
  const isDesignSystem = pkgName === '@gravitational/design-system';

  let changelog;
  try {
    changelog = await readFile(join(pkg.dir, 'CHANGELOG.md'), 'utf8');
  } catch (err) {
    if (isErrorWithCode(err, 'ENOENT')) {
      return;
    }

    throw err;
  }

  let changelogEntry = getChangelogEntry(changelog, version);
  if (!changelogEntry.content) {
    throw new Error(`Could not find changelog entry for ${version}`);
  }

  const distTarGz = join(pkg.dir, 'dist', 'package.tgz');
  const assetName = `${pkgName.replace('@gravitational/', '')}.tgz`;

  const releaseName = isDesignSystem ? version : `${pkgName}@${version}`;
  const releaseTag = isDesignSystem ? `v${version}` : `${pkgName}@${version}`;

  const release = await octokit.rest.repos.createRelease({
    name: releaseName,
    tag_name: releaseTag,
    body: changelogEntry.content,
    prerelease: version.includes('-'),
    repo,
    owner,
    make_latest: isDesignSystem ? 'true' : 'false',
  });

  await octokit.rest.repos.uploadReleaseAsset({
    owner,
    repo,
    release_id: release.data.id,
    name: assetName,
    headers: {
      'content-type': 'application/gzip',
    },
    data: (await readFile(distTarGz)) as unknown as string,
  });
}

function isErrorWithCode(err: unknown, code: string) {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    err.code === code
  );
}

interface ChangelogEntry {
  content: string;
  highestLevel: number;
}

function getChangelogEntry(changelog: string, version: string): ChangelogEntry {
  let ast = unified().use(remarkParse).parse(changelog);

  let highestLevel: number = BumpLevels.dep;

  let nodes = ast.children;
  let headingStartInfo:
    | {
        index: number;
        depth: number;
      }
    | undefined;
  let endIndex: number | undefined;

  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];

    if (node.type === 'heading') {
      let stringified: string = toString(node);
      let match = /(major|minor|patch)/.exec(stringified.toLowerCase());

      if (match !== null) {
        let level = BumpLevels[match[0] as 'major' | 'minor' | 'patch'];
        highestLevel = Math.max(level, highestLevel);
      }

      if (headingStartInfo === undefined && stringified === version) {
        headingStartInfo = {
          index: i,
          depth: node.depth,
        };

        continue;
      }

      if (
        endIndex === undefined &&
        headingStartInfo !== undefined &&
        headingStartInfo.depth === node.depth
      ) {
        endIndex = i;

        break;
      }
    }
  }

  if (headingStartInfo) {
    ast.children = ast.children.slice(headingStartInfo.index + 1, endIndex);
  }

  return {
    content: unified().use(remarkStringify).stringify(ast),
    highestLevel: highestLevel,
  };
}
