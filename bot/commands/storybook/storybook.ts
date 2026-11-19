import * as core from '@actions/core';
import { Octokit, type RestEndpointMethodTypes } from '@octokit/rest';
import { command, number, option, string, subcommands } from 'cmd-ts';

import { createOctokit } from '../../util';
import { storybookNukeCommand } from './nuke';

const storybookCommentCommand = command({
  name: 'comment',
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

    await runStorybookCommand(octokit, owner, repo, pullNumber);
  },
});

export const storybookCommand = subcommands({
  name: 'storybook',
  cmds: {
    comment: storybookCommentCommand,
    'nuke-previews': storybookNukeCommand,
  },
});

async function runStorybookCommand(
  octokit: Octokit,
  owner: string,
  repo: string,
  pull_number: number
) {
  const baseUrl = 'https://design.teleport.dev';
  const storybookUrl = `${baseUrl}/pr/${pull_number}`;

  const commentId = await getStorybookCommentId(octokit, {
    owner,
    repo,
    issue_number: pull_number,
  });

  const prComment: RestEndpointMethodTypes['issues']['createComment']['parameters'] =
    {
      owner,
      repo,
      issue_number: pull_number,
      body: getStorybookMessage(storybookUrl),
    };

  if (commentId != null) {
    await octokit.rest.issues.updateComment({
      ...prComment,
      comment_id: commentId,
    });

    core.info(`Updated storybook comment ${commentId}`);
  } else {
    const comment = await octokit.rest.issues.createComment(prComment);

    core.info(`Created storybook comment ${comment.data.id}`);
  }
}

function getStorybookMessage(storybookUrl: string) {
  return `### 📚 Storybook Preview

🔗 **[View Storybook Preview](${storybookUrl})**

This preview will be updated automatically when new commits are pushed to this PR.
`;
}

async function getStorybookCommentId(
  octokit: Octokit,
  params: { repo: string; owner: string; issue_number: number }
) {
  const comments = await octokit.rest.issues.listComments(params);
  const storybookBotComment = comments.data.find(
    comment =>
      comment.user?.login === 'github-actions[bot]' &&
      comment.body?.includes('📚 Storybook Preview')
  );
  return storybookBotComment ? storybookBotComment.id : null;
}
