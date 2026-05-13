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
      description: 'Commit SHA the artifact was built from',
    }),
    runId: option({
      type: string,
      long: 'run-id',
      description: 'Workflow run ID that produced the artifact',
    }),
    artifactId: option({
      type: string,
      long: 'artifact-id',
      description: 'ID of the uploaded artifact',
    }),
    artifactName: option({
      type: string,
      long: 'artifact-name',
      description: 'Name of the uploaded artifact',
    }),
  },
  handler: async ({
    owner,
    repo,
    pullNumber,
    sha,
    runId,
    artifactId,
    artifactName,
  }) => {
    const octokit = createOctokit();
    const artifactUrl = `https://github.com/${owner}/${repo}/actions/runs/${runId}/artifacts/${artifactId}`;
    const body = renderActiveBody({
      owner,
      repo,
      sha,
      artifactUrl,
      artifactName,
    });

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
      core.info('No dev-release comment to clean up.');
      return;
    }

    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: commentId,
      body: renderArchivedBody(),
    });
    core.info(`Marked dev-release comment ${commentId} as archived.`);
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

function renderActiveBody({
  owner,
  repo,
  sha,
  artifactUrl,
  artifactName,
}: {
  owner: string;
  repo: string;
  sha: string;
  artifactUrl: string;
  artifactName: string;
}) {
  const shortSha = sha.slice(0, 7);
  const commitUrl = `https://github.com/${owner}/${repo}/commit/${sha}`;

  return `${COMMENT_MARKER}
### 📦 Dev Release

A development build of this PR is available as a workflow artifact.

- **Built from:** [\`${shortSha}\`](${commitUrl})
- **Download:** [\`${artifactName}.zip\`](${artifactUrl})

The download is a zip containing \`package.tgz\`. To use it in another repo:

\`\`\`sh
unzip ${artifactName}.zip
pnpm add ./package.tgz
\`\`\`

This comment is updated when new commits are pushed. The artifact is deleted when the PR is closed or the \`dev-release\` label is removed.
`;
}

function renderArchivedBody() {
  return `${COMMENT_MARKER}
### 📦 Dev Release

The dev release artifact for this PR has been deleted.
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
