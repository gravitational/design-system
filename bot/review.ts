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

interface PullRequestContext {
  owner: string;
  repo: string;
  pullNumber: number;
  author: string;
  isDraft: boolean;
  needsDesignReview: boolean;
  isRelease: boolean;
}

interface HumanReview {
  id: number;
  state: string;
  user?: string;
}

interface ReviewState {
  humanReviews: HumanReview[];
  requestedReviewers: {
    users: string[];
    teams: string[];
  };
  approvedBy: Set<string>;
}

interface ApprovalValidation {
  isValid: boolean;
  missingGroups: {
    group1: boolean;
    group2: boolean;
    design: boolean;
  };
  eligibleReviewers: {
    group1: string[];
    group2: string[];
    design: string[];
  };
}

export async function runCheckReviewersCommand(
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

  const validationResult = validateApprovals(context, reviewState);

  if (!validationResult.isValid) {
    reportValidationFailure(validationResult);

    return;
  }

  await dismissNonApprovedReviews(octokit, context, reviewState);
}

export async function runAssignReviewersCommand(
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

async function getPullRequestContext(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<PullRequestContext> {
  const { data: pullRequest } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
  });

  return {
    owner,
    repo,
    pullNumber,
    author: pullRequest.user.login,
    isDraft: pullRequest.draft ?? false,
    needsDesignReview: pullRequest.labels.some(
      l => l.name === 'needs-design-review'
    ),
    isRelease: pullRequest.user.login === 'design-system-release[bot]',
  };
}

async function getReviewState(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  prAuthor: string
): Promise<ReviewState> {
  const [reviews, requestedReviewers] = await Promise.all([
    octokit.rest.pulls.listReviews({
      owner,
      repo,
      pull_number: pullNumber,
    }),
    octokit.rest.pulls.listRequestedReviewers({
      owner,
      repo,
      pull_number: pullNumber,
    }),
  ]);

  const humanReviews = reviews.data
    .filter(
      review =>
        review.user &&
        !review.user.login.includes('[bot]') &&
        review.user.login !== prAuthor
    )
    .map(r => ({
      id: r.id,
      state: r.state,
      user: r.user?.login,
    }));

  const approvedBy = new Set(
    humanReviews
      .filter(r => r.state === 'APPROVED')
      .map(r => r.user)
      .filter(Boolean) as string[]
  );

  const users = requestedReviewers.data.users
    .map(u => u.login)
    .filter(u => u !== prAuthor);

  const teams = requestedReviewers.data.teams.map(t => t.name);

  return {
    humanReviews,
    requestedReviewers: {
      users,
      teams,
    },
    approvedBy,
  };
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

  const designToRequest = DESIGN_REVIEWERS.filter(
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
    reviewState.requestedReviewers.users.length > 0 ||
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
  const eligibleGroup1 = GROUP1_REVIEWERS.filter(r => r !== context.author);
  const eligibleGroup2 = GROUP2_REVIEWERS.filter(r => r !== context.author);

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

function selectRandomReviewers(
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

function validateApprovals(
  context: PullRequestContext,
  reviewState: ReviewState
): ApprovalValidation {
  const eligibleGroup1 = GROUP1_REVIEWERS.filter(u => u !== context.author);
  const eligibleGroup2 = GROUP2_REVIEWERS.filter(u => u !== context.author);
  const eligibleDesign = DESIGN_REVIEWERS.filter(u => u !== context.author);

  const group1Approved = GROUP1_REVIEWERS.some(u =>
    reviewState.approvedBy.has(u)
  );

  if (context.isRelease) {
    return {
      isValid: group1Approved,
      missingGroups: {
        group1: !group1Approved,
        group2: false,
        design: false,
      },
      eligibleReviewers: {
        group1: eligibleGroup1,
        group2: [],
        design: [],
      },
    };
  }

  // count any approver not in group 1 or design as group 2 whilst we do not have the full
  // team being requested for review automatically
  const group2Approved = Array.from(reviewState.approvedBy).some(
    approver =>
      !GROUP1_REVIEWERS.includes(approver) &&
      !DESIGN_REVIEWERS.includes(approver)
  );
  const designApproved = DESIGN_REVIEWERS.some(u =>
    reviewState.approvedBy.has(u)
  );

  const hasEligibleGroup1 = eligibleGroup1.length > 0;

  const needsGroup1 = hasEligibleGroup1 && !group1Approved;
  const needsGroup2 = !group2Approved;
  const needsDesign = context.needsDesignReview && !designApproved;

  const isValid = hasEligibleGroup1
    ? group1Approved &&
      group2Approved &&
      (!context.needsDesignReview || designApproved)
    : group2Approved && (!context.needsDesignReview || designApproved);

  return {
    isValid,
    missingGroups: {
      group1: needsGroup1,
      group2: needsGroup2,
      design: needsDesign,
    },
    eligibleReviewers: {
      group1: eligibleGroup1,
      group2: eligibleGroup2,
      design: eligibleDesign,
    },
  };
}

function reportValidationFailure(validation: ApprovalValidation) {
  const failureReasons: string[] = [];

  if (validation.missingGroups.group1 && validation.missingGroups.group2) {
    failureReasons.push('Required approvals missing: group 1 and group 2.');
  } else if (validation.missingGroups.group1) {
    failureReasons.push('Required approvals missing: group 1.');
  } else if (validation.missingGroups.group2) {
    failureReasons.push('Needs group 2 approval.');
  }

  if (validation.missingGroups.design) {
    failureReasons.push('Design approval required.');
  }

  core.error('Eligible approvers');

  if (validation.missingGroups.group1) {
    core.error(
      `Group 1: ${formatReviewers(validation.eligibleReviewers.group1)}`
    );
  }

  if (validation.missingGroups.group2) {
    core.error(
      `Group 2: ${formatReviewers(validation.eligibleReviewers.group2)}`
    );
  }

  if (validation.missingGroups.design) {
    core.error(
      `Design: ${formatReviewers(validation.eligibleReviewers.design)}`
    );
  }

  core.setFailed(`Approval policy not met: ${failureReasons.join(' ')}`);
}

function formatReviewers(reviewers: string[]): string {
  return reviewers.length > 0 ? reviewers.join(', ') : 'none';
}

async function dismissNonApprovedReviews(
  octokit: Octokit,
  context: PullRequestContext,
  reviewState: ReviewState
) {
  const toDismiss = reviewState.humanReviews.filter(
    r => r.state !== 'APPROVED' && r.state !== 'DISMISSED'
  );

  if (toDismiss.length === 0) {
    core.info('There are approvals but no other human reviews to dismiss');
    return;
  }

  core.info(
    `Found approval; dismissing ${toDismiss.length} other review(s): ` +
      toDismiss.map(r => r.user).join(', ')
  );

  for (const review of toDismiss) {
    try {
      await octokit.rest.pulls.dismissReview({
        owner: context.owner,
        repo: context.repo,
        pull_number: context.pullNumber,
        review_id: review.id,
        message: 'Dismissing non-approved review because the PR is approved.',
      });

      core.info(`Dismissed review ${review.id} (${review.user})`);
    } catch (error) {
      core.error(
        `Failed to dismiss review ${review.id} (${review.user}): ${resolveErrorMessage(error)}`
      );
    }
  }
}
