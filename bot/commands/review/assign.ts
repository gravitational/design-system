import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import { command, number, option, string } from 'cmd-ts';

import { createOctokit, resolveErrorMessage } from '../../util';
import {
  getPullRequestContext,
  getReviewerPool,
  getReviewState,
  type PullRequestContext,
  type ReviewState,
} from './common';

export const assignReviewersCommand = command({
  name: 'assign-reviewers',
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

    await runAssignReviewersCommand(octokit, owner, repo, pullNumber);
  },
});

async function runAssignReviewersCommand(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number
) {
  const context = await getPullRequestContext(octokit, owner, repo, pullNumber);

  if (context.isDraft) {
    core.info('Skipping draft PR');
    return;
  }

  const reviewState = await getReviewState(
    octokit,
    owner,
    repo,
    pullNumber,
    context.author
  );

  await handleDesignReviewers(octokit, context, reviewState);
  await handleInitialReviewerAssignment(octokit, context, reviewState);
}

async function handleDesignReviewers(
  octokit: Octokit,
  context: PullRequestContext,
  reviewState: ReviewState
) {
  if (!context.needsDesignReview) {
    return;
  }

  const alreadyHandled = new Set([
    ...reviewState.requestedReviewers.users,
    ...Array.from(reviewState.approvedBy),
    ...(reviewState.humanReviews.map(r => r.user).filter(Boolean) as string[]),
  ]);

  const designToRequest = getReviewerPool(context, 'design').filter(
    r => r !== context.author && !alreadyHandled.has(r)
  );

  if (designToRequest.length === 0) {
    core.info(
      'No eligible design reviewers to request (or already requested).'
    );

    return;
  }

  try {
    await octokit.rest.pulls.requestReviewers({
      owner: context.owner,
      repo: context.repo,
      pull_number: context.pullNumber,
      reviewers: designToRequest,
    });

    core.info(`Requested design review from: ${designToRequest.join(', ')}`);
  } catch (error) {
    core.error(
      `Error requesting design reviewers: ${resolveErrorMessage(error)}`
    );
  }
}

async function handleInitialReviewerAssignment(
  octokit: Octokit,
  context: PullRequestContext,
  reviewState: ReviewState
) {
  const hasExistingReviewActivity =
    reviewState.humanReviews.length > 0 ||
    reviewState.requestedReviewers.users.length > 1 ||
    reviewState.requestedReviewers.teams.length > 0;

  if (hasExistingReviewActivity) {
    const reason =
      reviewState.humanReviews.length > 0
        ? 'PR already has reviews'
        : 'PR already has reviewers assigned';

    core.info(`${reason}, skipping random assignment`);

    return;
  }

  await assignRandomReviewers(octokit, context);
}

async function assignRandomReviewers(
  octokit: Octokit,
  context: PullRequestContext
) {
  const eligibleGroup1 = getReviewerPool(context, 'group1').filter(
    r => r !== context.author
  );
  const eligibleGroup2 = getReviewerPool(context, 'group2').filter(
    r => r !== context.author
  );

  const reviewers = selectRandomReviewers(
    eligibleGroup1,
    eligibleGroup2,
    context.isRelease
  );

  if (reviewers.length === 0) {
    core.warning('No eligible reviewers available');
    return;
  }

  try {
    await octokit.rest.pulls.requestReviewers({
      owner: context.owner,
      repo: context.repo,
      pull_number: context.pullNumber,
      reviewers,
    });

    const message =
      reviewers.length > 1
        ? `Successfully assigned reviewers: ${reviewers.join(' and ')}`
        : `Successfully assigned reviewer: ${reviewers[0]}`;

    core.info(message);
  } catch (error) {
    core.error(`Error assigning reviewer: ${resolveErrorMessage(error)}`);
  }
}

export function selectRandomReviewers(
  eligibleGroup1: string[],
  eligibleGroup2: string[],
  isRelease: boolean
): string[] {
  const reviewers: string[] = [];

  if (eligibleGroup1.length > 0) {
    const randomIndex = Math.floor(Math.random() * eligibleGroup1.length);

    reviewers.push(eligibleGroup1[randomIndex]);
  }

  if (isRelease) {
    return reviewers;
  }

  if (eligibleGroup2.length > 0) {
    const shuffled = [...eligibleGroup2].sort(() => Math.random() - 0.5);
    const count =
      eligibleGroup1.length === 0 ? Math.min(2, eligibleGroup2.length) : 1;

    reviewers.push(...shuffled.slice(0, count));
  }

  return reviewers;
}
