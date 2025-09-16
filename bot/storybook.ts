import * as core from '@actions/core';
import { Octokit, type RestEndpointMethodTypes } from '@octokit/rest';

export async function runStorybookCommand(
  octokit: Octokit,
  params: {
    owner: string;
    repo: string;
    pull_number: number;
  }
) {
  const baseUrl = 'https://design.teleport.dev';
  const storybookUrl = `${baseUrl}/pr/${params.pull_number}`;

  const commentId = await getStorybookCommentId(octokit, {
    owner: params.owner,
    repo: params.repo,
    issue_number: params.pull_number,
  });

  const prComment: RestEndpointMethodTypes['issues']['createComment']['parameters'] =
    {
      owner: params.owner,
      repo: params.repo,
      issue_number: params.pull_number,
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
