import * as core from '@actions/core';
import { Octokit, type RestEndpointMethodTypes } from '@octokit/rest';
import { command, number, option, string, subcommands } from 'cmd-ts';

import { createOctokit } from '../../util';

const COMMENT_MARKER = '<!-- design-system:dev-release -->';

const postCommand = command({
  name: 'post',
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
    sha: option({
      type: string,
      long: 'sha',
      description: 'Commit SHA the tarball was built from',
    }),
    tag: option({
      type: string,
      long: 'tag',
      description: 'Release tag the tarball is attached to',
    }),
    assetName: option({
      type: string,
      long: 'asset-name',
      description: 'Filename of the tarball asset',
    }),
  },
  handler: async ({ owner, repo, pullNumber, sha, tag, assetName }) => {
    const octokit = createOctokit();
    const tarballUrl = `https://github.com/${owner}/${repo}/releases/download/${tag}/${assetName}`;
    const body = renderBody({ owner, repo, sha, tarballUrl });

    await upsertComment(octokit, owner, repo, pullNumber, body);
  },
});

const cleanupCommand = command({
  name: 'cleanup',
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
  },
  handler: async ({ owner, repo, pullNumber }) => {
    const octokit = createOctokit();
    const commentId = await getDevReleaseCommentId(octokit, {
      owner,
      repo,
      issue_number: pullNumber,
    });

    if (commentId == null) {
      core.info('No dev-release comment to delete.');
      return;
    }

    await octokit.rest.issues.deleteComment({
      owner,
      repo,
      comment_id: commentId,
    });
    core.info(`Deleted dev-release comment ${commentId}.`);
  },
});

export const devReleaseCommand = subcommands({
  name: 'dev-release',
  cmds: {
    post: postCommand,
    cleanup: cleanupCommand,
  },
});

async function upsertComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  pull_number: number,
  body: string
) {
  const commentId = await getDevReleaseCommentId(octokit, {
    owner,
    repo,
    issue_number: pull_number,
  });

  const params: RestEndpointMethodTypes['issues']['createComment']['parameters'] =
    {
      owner,
      repo,
      issue_number: pull_number,
      body,
    };

  if (commentId != null) {
    await octokit.rest.issues.updateComment({
      ...params,
      comment_id: commentId,
    });
    core.info(`Updated dev-release comment ${commentId}.`);
  } else {
    const comment = await octokit.rest.issues.createComment(params);
    core.info(`Created dev-release comment ${comment.data.id}.`);
  }
}

function renderBody({
  owner,
  repo,
  sha,
  tarballUrl,
}: {
  owner: string;
  repo: string;
  sha: string;
  tarballUrl: string;
}) {
  const shortSha = sha.slice(0, 7);
  const commitUrl = `https://github.com/${owner}/${repo}/commit/${sha}`;

  return `${COMMENT_MARKER}
### 📦 Dev Release

A dev release of \`@gravitational/design-system\` is available for this PR.

- **Built from:** [\`${shortSha}\`](${commitUrl})
- **Tarball:** ${tarballUrl}

Add this to your \`package.json\`:

\`\`\`json
"@gravitational/design-system": "${tarballUrl}"
\`\`\`

The URL changes with each commit (includes the short SHA), so update your \`package.json\` after each new commit. The release is deleted when the PR is closed or the \`dev-release\` label is removed.
`;
}

async function getDevReleaseCommentId(
  octokit: Octokit,
  params: { repo: string; owner: string; issue_number: number }
) {
  const comments = await octokit.paginate(
    octokit.rest.issues.listComments,
    params
  );
  const devReleaseComment = comments.find(
    comment =>
      comment.user?.login === 'github-actions[bot]' &&
      comment.body?.includes(COMMENT_MARKER)
  );
  return devReleaseComment ? devReleaseComment.id : null;
}
