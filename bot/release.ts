import { readFile } from 'node:fs/promises';

import { Octokit } from '@octokit/rest';
import { toString } from 'mdast-util-to-string';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import { unified } from 'unified';

const BumpLevels = {
  dep: 0,
  patch: 1,
  minor: 2,
  major: 3,
} as const;

export async function runReleaseCommand(
  octokit: Octokit,
  params: {
    owner: string;
    repo: string;
    version: string;
    tar_gz_path: string;
  }
) {
  let changelog;
  try {
    changelog = await readFile('CHANGELOG.md', 'utf8');
  } catch (err) {
    if (isErrorWithCode(err, 'ENOENT')) {
      return;
    }

    throw err;
  }

  let changelogEntry = getChangelogEntry(changelog, params.version);
  if (!changelogEntry.content) {
    throw new Error(`Could not find changelog entry for ${params.version}`);
  }

  const release = await octokit.rest.repos.createRelease({
    name: params.version,
    tag_name: `v${params.version}`,
    body: changelogEntry.content,
    prerelease: params.version.includes('-'),
    repo: params.repo,
    owner: params.owner,
  });

  await octokit.rest.repos.uploadReleaseAsset({
    owner: params.owner,
    repo: params.repo,
    release_id: release.data.id,
    name: 'design-system.tgz',
    headers: {
      'content-type': 'application/gzip',
    },
    data: await readFile(params.tar_gz_path, 'utf-8'),
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
