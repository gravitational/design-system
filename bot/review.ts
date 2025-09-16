import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

import { resolveErrorMessage } from './util.ts';

const DESIGN_SYSTEM_REVIEWERS = ['ryanclark', 'strideynet'];

export async function runReviewerCommand(
  octokit: Octokit,
  params: {
    owner: string;
    repo: string;
    pull_number: number;
  }
) {
  const pullRequest = await octokit.rest.pulls.get({
    owner: params.owner,
    repo: params.repo,
    pull_number: params.pull_number,
  });

  if (pullRequest.data.draft) {
    core.info('Skipping draft PR');
    return;
  }

  const existingReviewers = await octokit.rest.pulls.listRequestedReviewers({
    owner: params.owner,
    repo: params.repo,
    pull_number: params.pull_number,
  });

  if (
    existingReviewers.data.users.length > 0 ||
    existingReviewers.data.teams.length > 0
  ) {
    core.info('PR already has reviewers assigned, skipping random assignment');
    return;
  }

  const reviews = await octokit.rest.pulls.listReviews({
    owner: params.owner,
    repo: params.repo,
    pull_number: params.pull_number,
  });

  const prAuthor = pullRequest.data.user.login;
  const humanReviews = reviews.data.filter(
    review =>
      review.user &&
      !review.user.login.includes('[bot]') &&
      review.user.login !== prAuthor
  );

  if (humanReviews.length > 0) {
    core.info('PR already has reviews, skipping random assignment');
    return;
  }

  await assignRandomReviewer(octokit, {
    owner: params.owner,
    repo: params.repo,
    pull_number: params.pull_number,
    pr_author: prAuthor,
  });
}

async function assignRandomReviewer(
  octokit: Octokit,
  params: {
    owner: string;
    repo: string;
    pull_number: number;
    pr_author: string;
  }
) {
  const eligibleReviewers = DESIGN_SYSTEM_REVIEWERS.filter(
    r => r !== params.pr_author
  );

  if (eligibleReviewers.length === 0) {
    core.warning('No eligible reviewers available');
    return;
  }

  const randomIndex = Math.floor(Math.random() * eligibleReviewers.length);
  const selectedReviewer = eligibleReviewers[randomIndex];

  try {
    await octokit.rest.pulls.requestReviewers({
      owner: params.owner,
      repo: params.repo,
      pull_number: params.pull_number,
      reviewers: [selectedReviewer],
    });

    core.info(`Successfully assigned reviewer: ${selectedReviewer}`);

    return selectedReviewer;
  } catch (error) {
    core.error(`Error assigning reviewer: ${resolveErrorMessage(error)}`);

    return null;
  }
}
