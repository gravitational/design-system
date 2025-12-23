import * as core from '@actions/core';
import { ValidationError } from '@changesets/errors';
import type {
  ComprehensiveRelease,
  ReleasePlan,
  VersionType,
} from '@changesets/types';
import { Octokit } from '@octokit/rest';
import { command, number, option, string } from 'cmd-ts';
import { humanId } from 'human-id';

import { createOctokit, resolveErrorMessage } from '../../util';
import { getChangedPackages } from './getChangedPackages';

export const changesetCommand = command({
  name: 'changeset',
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
    pullNumber: option({
      type: number,
      long: 'pull-number',
      short: 'p',
      description: 'Pull request number',
    }),
    action: option({
      type: string,
      long: 'action',
      short: 'a',
      description: 'Action to perform (e.g., synchronize)',
    }),
  },
  handler: async ({ owner, repo, pullNumber, action }) => {
    const octokit = createOctokit();

    await runChangesetCommand(octokit, owner, repo, pullNumber, action);
  },
});

async function runChangesetCommand(
  octokit: Octokit,
  owner: string,
  repo: string,
  pull_number: number,
  action: string
) {
  const pullRequest = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number,
  });

  if (pullRequest.data.head.ref.startsWith('changeset-release')) {
    core.info('Skipping changeset-release branch');
    return;
  }

  let errFromFetchingChangedFiles = '';

  const latestCommitSha = pullRequest.data.head.sha;
  const headRepo = pullRequest.data.head.repo;

  const [commentId, hasChangeset, { changedPackages, releasePlan }] =
    await Promise.all([
      action === 'synchronize'
        ? getCommentId(octokit, {
            owner,
            repo,
            issue_number: pull_number,
          })
        : Promise.resolve(undefined),
      hasChangesetBeenAdded(octokit, {
        owner,
        repo,
        pull_number,
      }),
      getChangedPackages({
        repo: headRepo.name,
        owner: headRepo.owner.login,
        ref: pullRequest.data.head.ref,
        changedFiles: octokit.rest.pulls
          .listFiles({
            owner,
            repo,
            pull_number,
          })
          .then(x => x.data.map(file => file.filename)),
        octokit,
      }).catch((err: unknown) => {
        if (err instanceof ValidationError) {
          errFromFetchingChangedFiles = `<details><summary>💥 An error occurred when fetching the changed packages and changesets in this PR</summary>\n\n\`\`\`\n${err.message}\n\`\`\`\n\n</details>\n`;
        } else {
          core.error(
            `Error fetching changed packages: ${resolveErrorMessage(err)}`
          );
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
  })}.md&value=${getNewChangesetTemplate(packageName, pullRequest.data.title)}`;

  const prComment = {
    owner,
    repo,
    issue_number: pull_number,
    body:
      (hasChangeset
        ? getApproveMessage(latestCommitSha, addChangesetUrl, releasePlan)
        : getAbsentMessage(latestCommitSha, addChangesetUrl)) +
      errFromFetchingChangedFiles,
  };

  if (commentId != null) {
    await octokit.rest.issues.updateComment({
      ...prComment,
      comment_id: commentId,
    });

    core.info(`Updated changeset comment ${commentId}`);
  } else {
    const comment = await octokit.rest.issues.createComment(prComment);

    core.info(`Created changeset comment ${comment.data.id}`);
  }
}

function getReleasePlanMessage(releasePlan: ReleasePlan | null) {
  if (!releasePlan) {
    return '';
  }

  const publishableReleases = releasePlan.releases.filter(
    (x): x is ComprehensiveRelease & { type: Exclude<VersionType, 'none'> } =>
      x.type !== 'none'
  );

  if (!publishableReleases.length) {
    return `#### 📋 Release Plan

_No changesets found. When changesets are added to this PR, you'll see the packages and versions that will be released._`;
  }

  if (!releasePlan.changesets.length) {
    return `#### 📋 Release Plan

_No changesets found. When changesets are added to this PR, you'll see the packages and versions that will be released._`;
  }

  let versionTable = '| Package | Version | Type |\n';
  versionTable += '| :--- | :--- | :--- |';

  for (const release of publishableReleases) {
    const versionType = release.type;

    versionTable += `\n| **${release.name}** | \`${release.oldVersion}\` → \`${release.newVersion}\` | ${versionType} |`;
  }

  const changesetsCount = releasePlan.changesets.length;
  const packagesCount = publishableReleases.length;

  return `#### 📋 Release Plan

This PR will trigger releases for **${packagesCount} package${packagesCount > 1 ? 's' : ''}** with **${changesetsCount} changeset${changesetsCount > 1 ? 's' : ''}**:

${versionTable}`;
}

function getAbsentMessage(commitSha: string, addChangesetUrl: string) {
  return `### ⚠️ No changeset found

Latest commit: ${commitSha}

This PR will **not** trigger a version bump when merged.

---

If merging this PR should trigger a release, you need to add a changeset. If not, you can ignore this message.

[**Add a changeset to this PR**](${addChangesetUrl}) • [**Learn about changesets**](https://github.com/gravitational/design-system/blob/main/guides/changesets.md)

`;
}

function getApproveMessage(
  commitSha: string,
  addChangesetUrl: string,
  releasePlan: ReleasePlan | null
) {
  return `### ✅ Changeset detected

Latest commit: ${commitSha}

${getReleasePlanMessage(releasePlan)}

---

[**Add another changeset to this PR**](${addChangesetUrl}) • [**Learn about changesets**](https://github.com/gravitational/design-system/blob/main/guides/changesets.md)

`;
}

function getNewChangesetTemplate(packageName: string, title: string) {
  return encodeURIComponent(`---
'${packageName}': patch
---

${title}
`);
}

async function getCommentId(
  octokit: Octokit,
  params: { repo: string; owner: string; issue_number: number }
) {
  const comments = await octokit.paginate(octokit.rest.issues.listComments, {
    ...params,
    per_page: 100,
  });

  const changesetBotComment = comments.find(
    comment =>
      comment.user?.login === 'github-actions[bot]' &&
      /No Changeset found|Changeset detected/i.test(comment.body ?? '')
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
