import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

import { resolveErrorMessage } from './util.ts';

const GROUP1_REVIEWERS = ['ryanclark'];
const GROUP2_REVIEWERS = ['strideynet'];

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

  await assignRandomReviewers(octokit, {
    owner: params.owner,
    repo: params.repo,
    pull_number: params.pull_number,
    pr_author: prAuthor,
  });
}

async function assignRandomReviewers(
  octokit: Octokit,
  params: {
    owner: string;
    repo: string;
    pull_number: number;
    pr_author: string;
  }
) {
  const eligibleGroup1 = GROUP1_REVIEWERS.filter(r => r !== params.pr_author);
  const eligibleGroup2 = GROUP2_REVIEWERS.filter(r => r !== params.pr_author);

  const reviewers: string[] = [];

  if (eligibleGroup1.length > 0) {
    const shuffledGroup1 = eligibleGroup1.toSorted(() => Math.random() - 0.5);
    reviewers.push(shuffledGroup1[0]);
  }

  if (eligibleGroup2.length > 0) {
    const shuffledGroup2 = eligibleGroup2.toSorted(() => Math.random() - 0.5);
    const group2Count =
      eligibleGroup1.length === 0 ? Math.min(2, eligibleGroup2.length) : 1;

    reviewers.push(...shuffledGroup2.slice(0, group2Count));
  }

  if (reviewers.length === 0) {
    core.warning('No eligible reviewers available');
    return;
  }

  try {
    await octokit.rest.pulls.requestReviewers({
      owner: params.owner,
      repo: params.repo,
      pull_number: params.pull_number,
      reviewers,
    });

    if (reviewers.length > 1) {
      core.info(`Successfully assigned reviewers: ${reviewers.join(' and ')}`);
      return reviewers;
    }

    core.info(`Successfully assigned reviewer: ${reviewers[0]}`);

    return reviewers;
  } catch (error) {
    core.error(`Error assigning reviewer: ${resolveErrorMessage(error)}`);

    return null;
  }
}
