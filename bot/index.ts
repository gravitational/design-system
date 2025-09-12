/* eslint-disable no-console */
import { ValidationError } from '@changesets/errors';
import type {
  ComprehensiveRelease,
  ReleasePlan,
  VersionType,
} from '@changesets/types';
import { Octokit } from '@octokit/rest';
import { humanId } from 'human-id';

import { getChangedPackages } from './getChangedPackages';

function getReleasePlanMessage(releasePlan: ReleasePlan | null) {
  if (!releasePlan) {
    return '';
  }

  const publishableRelease = releasePlan.releases.find(
    (x): x is ComprehensiveRelease & { type: Exclude<VersionType, 'none'> } =>
      x.type !== 'none'
  );

  if (!publishableRelease) {
    return `This PR includes no changesets

When changesets are added to this PR, you'll see the package version type that will be released`;
  }

  const versionType = {
    major: 'major',
    minor: 'minor',
    patch: 'patch',
  }[publishableRelease.type];

  return releasePlan.changesets.length
    ? `This PR includes changesets to release a ${versionType} version`
    : `This PR includes no changesets

When changesets are added to this PR, you'll see the package version type that will be released`;
}

function getAbsentMessage(
  commitSha: string,
  addChangesetUrl: string,
  releasePlan: ReleasePlan | null
) {
  return `###  ⚠️  No Changeset found

Latest commit: ${commitSha}

Merging this PR will not cause a version bump. If these changes should not result in a new version, you're good to go. **If these changes should result in a version bump, you need to add a changeset.**

${getReleasePlanMessage(releasePlan)}

[Click here to learn about changesets](https://github.com/gravitational/design-system/blob/main/guides/changesets.md).

[Click here to add a changeset to this PR](${addChangesetUrl})

`;
}

function getApproveMessage(
  commitSha: string,
  addChangesetUrl: string,
  releasePlan: ReleasePlan | null
) {
  return `### Changeset detected

Latest commit: ${commitSha}

**The changes in this PR will be included in the next version bump.**

${getReleasePlanMessage(releasePlan)}

[Click here to learn about changesets](https://github.com/gravitational/design-system/blob/main/guides/changesets.md).

[Click here to add another changeset to this PR](${addChangesetUrl})

`;
}

function getNewChangesetTemplate(packageName: string, title: string) {
  return encodeURIComponent(`---
"${packageName}": patch
---

${title}
`);
}

async function getCommentId(
  octokit: Octokit,
  params: { repo: string; owner: string; issue_number: number }
) {
  const comments = await octokit.rest.issues.listComments(params);
  const changesetBotComment = comments.data.find(
    comment => comment.user?.login === 'github-actions[bot]'
  );
  return changesetBotComment ? changesetBotComment.id : null;
}

async function hasChangesetBeenAdded(
  octokit: Octokit,
  params: { repo: string; owner: string; pull_number: number }
) {
  const files = await octokit.rest.pulls.listFiles(params);

  return files.data.some(
    file =>
      file.status === 'added' &&
      /^\.changeset\/.+\.md$/.test(file.filename) &&
      file.filename !== '.changeset/README.md'
  );
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    console.error('Usage: pnpm bot <owner> <repo> <pr-number> <action>');
    console.error(
      'Example: pnpm bot gravitational design-system 1 synchronize'
    );
    process.exit(1);
  }

  const [owner, repo, prNumber, action] = args;
  const pullNumber = parseInt(prNumber, 10);

  if (isNaN(pullNumber)) {
    console.error('PR number must be a valid number');
    process.exit(1);
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.error('GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  const octokit = new Octokit({
    auth: githubToken,
  });

  try {
    const pullRequest = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    });

    if (pullRequest.data.head.ref.startsWith('changeset-release')) {
      console.log('Skipping changeset-release branch');
      return;
    }

    let errFromFetchingChangedFiles = '';

    const latestCommitSha = pullRequest.data.head.sha;
    const headRepo = pullRequest.data.head.repo;

    const [commentId, hasChangeset, { changedPackages, releasePlan }] =
      await Promise.all([
        action === 'synchronize'
          ? getCommentId(octokit, { owner, repo, issue_number: pullNumber })
          : undefined,
        hasChangesetBeenAdded(octokit, {
          owner,
          repo,
          pull_number: pullNumber,
        }),
        getChangedPackages({
          repo: headRepo.name,
          owner: headRepo.owner.login,
          ref: pullRequest.data.head.ref,
          changedFiles: octokit.rest.pulls
            .listFiles({
              owner,
              repo,
              pull_number: pullNumber,
            })
            .then(x => x.data.map(file => file.filename)),
          octokit,
        }).catch((err: unknown) => {
          if (err instanceof ValidationError) {
            errFromFetchingChangedFiles = `<details><summary>💥 An error occurred when fetching the changed packages and changesets in this PR</summary>\n\n\`\`\`\n${err.message}\n\`\`\`\n\n</details>\n`;
          } else {
            console.error(err);
          }
          return {
            changedPackages: ['@fake-scope/fake-pkg'],
            releasePlan: null,
          };
        }),
      ] as const);

    const packageName = changedPackages[0] ?? '@fake-scope/fake-pkg';

    const addChangesetUrl = `${headRepo.html_url}/new/${
      pullRequest.data.head.ref
    }?filename=.changeset/${humanId({
      separator: '-',
      capitalize: false,
    })}.md&value=${getNewChangesetTemplate(
      packageName,
      pullRequest.data.title
    )}`;

    const prComment = {
      owner,
      repo,
      issue_number: pullNumber,
      body:
        (hasChangeset
          ? getApproveMessage(latestCommitSha, addChangesetUrl, releasePlan)
          : getAbsentMessage(latestCommitSha, addChangesetUrl, releasePlan)) +
        errFromFetchingChangedFiles,
    };

    if (commentId != null) {
      await octokit.rest.issues.updateComment({
        ...prComment,
        comment_id: commentId,
      });

      console.log(`Updated comment ${commentId}`);
    } else {
      const comment = await octokit.rest.issues.createComment(prComment);

      console.log(`Created comment ${comment.data.id}`);
    }
  } catch (err) {
    console.error('Error:', err);

    process.exit(1);
  }
}

main().catch((err: unknown) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
