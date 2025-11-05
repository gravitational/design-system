import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

import { resolveErrorMessage } from './util.ts';

const GROUP1_REVIEWERS = ['ryanclark'];
const GROUP2_REVIEWERS = [
  'bl-nero',
  'ravicious',
  'rudream',
  'mcbattirola',
  'nicholasmarais1158',
  'michellescripts',
];
const DESIGN_REVIEWERS = ['roraback'];

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

  const labels = pullRequest.data.labels.map(l => l.name);

  const needsDesignReview = labels.includes('needs-design-review');

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

  const existingReviewers = await octokit.rest.pulls.listRequestedReviewers({
    owner: params.owner,
    repo: params.repo,
    pull_number: params.pull_number,
  });

  if (needsDesignReview) {
    const alreadyRequested = new Set(
      existingReviewers.data.users.map(u => u.login)
    );

    const alreadyReviewed = new Set(
      humanReviews.map(r => r.user?.login).filter(Boolean) as string[]
    );

    const designToRequest = DESIGN_REVIEWERS.filter(
      r => r !== prAuthor && !alreadyRequested.has(r) && !alreadyReviewed.has(r)
    );

    if (designToRequest.length > 0) {
      try {
        await octokit.rest.pulls.requestReviewers({
          owner: params.owner,
          repo: params.repo,
          pull_number: params.pull_number,
          reviewers: designToRequest,
        });

        core.info(
          `Requested design review from: ${designToRequest.join(', ')}`
        );
      } catch (error) {
        core.error(
          `Error requesting design reviewers: ${resolveErrorMessage(error)}`
        );
      }
    } else {
      core.info(
        'No eligible design reviewers to request (or already requested).'
      );
    }
  }

  const hasAnyHumanReview = humanReviews.length > 0;
  const hasAnyRequestedReviewer =
    existingReviewers.data.users.length > 0 ||
    existingReviewers.data.teams.length > 0;

  if (!hasAnyHumanReview && !hasAnyRequestedReviewer) {
    await assignRandomReviewers(octokit, {
      owner: params.owner,
      repo: params.repo,
      pull_number: params.pull_number,
      pr_author: prAuthor,
    });
  } else if (hasAnyHumanReview) {
    core.info('PR already has reviews, skipping random assignment');
  } else if (hasAnyRequestedReviewer) {
    core.info('PR already has reviewers assigned, skipping random assignment');
  }

  const approvedBy = new Set(
    humanReviews
      .filter(r => r.state === 'APPROVED')
      .map(r => r.user?.login)
      .filter(Boolean) as string[]
  );

  const group1Approved = GROUP1_REVIEWERS.some(u => approvedBy.has(u));
  const group2Approved = GROUP2_REVIEWERS.some(u => approvedBy.has(u));
  const designApproved = DESIGN_REVIEWERS.some(u => approvedBy.has(u));

  const eligibleGroup1 = GROUP1_REVIEWERS.filter(u => u !== prAuthor);
  const eligibleGroup2 = GROUP2_REVIEWERS.filter(u => u !== prAuthor);
  const eligibleDesign = DESIGN_REVIEWERS.filter(u => u !== prAuthor);

  const hasEligibleGroup1 = eligibleGroup1.length > 0;

  const failureReasons: string[] = [];

  if (hasEligibleGroup1) {
    if (!group1Approved || !group2Approved) {
      failureReasons.push(
        `Required approvals missing: ${!group1Approved ? 'group 1' : ''}${!group1Approved && !group2Approved ? ' and ' : ''}${!group2Approved ? 'group 2' : ''}.`
      );
    }
  } else {
    if (!group2Approved) {
      failureReasons.push('Needs group 2 approval.');
    }
  }

  if (needsDesignReview && !designApproved) {
    failureReasons.push('Design approval required.');
  }

  if (failureReasons.length > 0) {
    const fmt = (arr: string[]) => (arr.length ? arr.join(', ') : 'none');

    core.error('Eligible approvers');

    if (!group1Approved && eligibleGroup1.length > 0) {
      core.error(`Group 1: ${fmt(eligibleGroup1)}`);
    }

    if (!group2Approved) {
      core.error(`Group 2: ${fmt(eligibleGroup2)}`);
    }

    if (needsDesignReview) {
      core.error(`Design: ${fmt(eligibleDesign)}`);
    }

    core.setFailed(`Approval policy not met: ${failureReasons.join(' ')}`);

    return;
  }

  await dismissOtherReviewsIfApproved(octokit, {
    owner: params.owner,
    repo: params.repo,
    pull_number: params.pull_number,
    pr_author: prAuthor,
    reviews: humanReviews,
  });
}

async function dismissOtherReviewsIfApproved(
  octokit: Octokit,
  params: {
    owner: string;
    repo: string;
    pull_number: number;
    pr_author: string;
    reviews: {
      id: number;
      state: string;
      user?: { login: string } | null;
    }[];
  }
) {
  const toDismiss = params.reviews.filter(
    r =>
      r.state !== 'APPROVED' &&
      r.state !== 'DISMISSED' &&
      r.user &&
      !r.user.login.includes('[bot]') &&
      r.user.login !== params.pr_author
  );

  if (toDismiss.length === 0) {
    core.info('There are approvals but no other human reviews to dismiss');
    return;
  }

  core.info(
    `Found approval; dismissing ${toDismiss.length} other review(s): ` +
      toDismiss.map(r => r.user?.login).join(', ')
  );

  for (const review of toDismiss) {
    try {
      await octokit.rest.pulls.dismissReview({
        owner: params.owner,
        repo: params.repo,
        pull_number: params.pull_number,
        review_id: review.id,
        message: 'Dismissing non-approved review because the PR is approved.',
      });
      core.info(`Dismissed review ${review.id} (${review.user?.login})`);
    } catch (error) {
      core.error(
        `Failed to dismiss review ${review.id} (${review.user?.login}): ${resolveErrorMessage(
          error
        )}`
      );
    }
  }
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
