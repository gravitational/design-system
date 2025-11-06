import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

import { resolveErrorMessage } from './util';

interface ReviewerDefinition {
  eu: string[];
  us: string[];
}

export const GROUP1_REVIEWERS: ReviewerDefinition = {
  eu: ['ryanclark'],
  us: [],
};

export const GROUP2_REVIEWERS: ReviewerDefinition = {
  eu: ['bl-nero', 'ravicious', 'nicholasmarais1158'],
  us: ['rudream', 'mcbattirola', 'michellescripts'],
};

export const DESIGN_REVIEWERS: ReviewerDefinition = {
  eu: [],
  us: ['roraback'],
};

export interface PullRequestContext {
  owner: string;
  repo: string;
  pullNumber: number;
  author: string;
  isDraft: boolean;
  needsDesignReview: boolean;
  isRelease: boolean;
  availableReviewers: {
    group1: string[];
    group2: string[];
    design: string[];
  };
  fallbackReviewers: {
    group1: string[];
    group2: string[];
    design: string[];
  };
}

interface HumanReview {
  id: number;
  state: string;
  user?: string;
}

export interface ReviewState {
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

  await dismissOldWorkflowRuns(octokit, context);

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

  const isEU = isEUWorkingHours();

  const availableReviewers = {
    group1: isEU ? GROUP1_REVIEWERS.eu : GROUP1_REVIEWERS.us,
    group2: isEU ? GROUP2_REVIEWERS.eu : GROUP2_REVIEWERS.us,
    design: isEU ? DESIGN_REVIEWERS.eu : DESIGN_REVIEWERS.us,
  };

  const fallbackReviewers = {
    group1: isEU ? GROUP1_REVIEWERS.us : GROUP1_REVIEWERS.eu,
    group2: isEU ? GROUP2_REVIEWERS.us : GROUP2_REVIEWERS.eu,
    design: isEU ? DESIGN_REVIEWERS.us : DESIGN_REVIEWERS.eu,
  };

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
    availableReviewers,
    fallbackReviewers,
  };
}

export interface Review {
  id: number;
  state: string;
  user?: {
    login: string;
  };
  author_association: string;
}

export function processReviewState(
  reviews: Review[],
  requestedUsers: string[],
  requestedTeams: string[],
  prAuthor: string
): ReviewState {
  const validAssociations = ['OWNER', 'MEMBER', 'COLLABORATOR'];
  const seenReviewers = new Set<string>();

  // Process reviews from the end first (latest reviews first)
  const humanReviews = reviews
    .slice()
    .reverse()
    .filter(
      review =>
        review.user &&
        !review.user.login.includes('[bot]') &&
        review.user.login !== prAuthor
    )
    .filter(review => {
      if (!review.user?.login) {
        return false;
      }

      if (seenReviewers.has(review.user.login)) {
        return false;
      }

      seenReviewers.add(review.user.login);

      return true;
    })
    .map(r => ({
      id: r.id,
      state: r.state,
      user: r.user?.login,
      authorAssociation: r.author_association,
    }));

  const approvedBy = new Set(
    humanReviews
      .filter(r => {
        if (r.state !== 'APPROVED') return false;

        if (!validAssociations.includes(r.authorAssociation)) {
          core.warning(
            `Ignoring approval from ${r.user} - not a member/collaborator (association: ${r.authorAssociation})`
          );

          return false;
        }

        return true;
      })
      .map(r => r.user)
      .filter(Boolean) as string[]
  );

  const users = requestedUsers.filter(u => u !== prAuthor);
  const teams = requestedTeams;

  return {
    humanReviews: humanReviews.map(r => ({
      id: r.id,
      state: r.state,
      user: r.user,
    })),
    requestedReviewers: {
      users,
      teams,
    },
    approvedBy,
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

  return processReviewState(
    reviews.data as Review[],
    requestedReviewers.data.users.map(u => u.login),
    requestedReviewers.data.teams.map(t => t.name),
    prAuthor
  );
}

export function getReviewerPool(
  context: PullRequestContext,
  group: 'group1' | 'group2' | 'design'
): string[] {
  const available = context.availableReviewers[group];
  if (available.length > 0) {
    return available;
  }

  core.info(`No available reviewers in ${group}, falling back to other region`);

  return context.fallbackReviewers[group];
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

export function validateApprovals(
  context: PullRequestContext,
  reviewState: ReviewState
): ApprovalValidation {
  const allGroup1 = [...GROUP1_REVIEWERS.eu, ...GROUP1_REVIEWERS.us];
  const allDesign = [...DESIGN_REVIEWERS.eu, ...DESIGN_REVIEWERS.us];

  const group1 = getReviewerPool(context, 'group1');
  const group2 = getReviewerPool(context, 'group2');
  const design = getReviewerPool(context, 'design');

  const eligibleGroup1 = group1.filter(u => u !== context.author);
  const eligibleGroup2 = group2.filter(u => u !== context.author);
  const eligibleDesign = design.filter(u => u !== context.author);

  const group1Approved = allGroup1.some(u => reviewState.approvedBy.has(u));

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
    approver => !allGroup1.includes(approver) && !allDesign.includes(approver)
  );
  const designApproved = allDesign.some(u => reviewState.approvedBy.has(u));

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

export function isEUWorkingHours() {
  const hours = new Date().getUTCHours();

  return hours >= 6 && hours < 18;
}

async function dismissOldWorkflowRuns(
  octokit: Octokit,
  context: PullRequestContext
) {
  try {
    const workflow = await findWorkflow(
      octokit,
      context.owner,
      context.repo,
      '.github/workflows/check-reviewers.yml'
    );

    if (!workflow) {
      core.warning('Check reviewers workflow not found');
      return;
    }

    const { data: pullRequest } = await octokit.rest.pulls.get({
      owner: context.owner,
      repo: context.repo,
      pull_number: context.pullNumber,
    });

    const runs = await listWorkflowRuns(
      octokit,
      context.owner,
      context.repo,
      pullRequest.head.ref,
      workflow.id
    );

    await deleteRuns(octokit, context.owner, context.repo, runs);
  } catch (error) {
    core.error(
      `Error dismissing old workflow runs: ${resolveErrorMessage(error)}`
    );
  }
}

async function findWorkflow(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string
): Promise<{ id: number; path: string } | null> {
  const { data: workflows } = await octokit.rest.actions.listRepoWorkflows({
    owner,
    repo,
  });

  const matching = workflows.workflows.filter(w => w.path === path);

  if (matching.length === 0) {
    return null;
  }

  if (matching.length > 1) {
    core.warning(`Found ${matching.length} matching workflows for ${path}`);
  }

  return {
    id: matching[0].id,
    path: matching[0].path,
  };
}

async function listWorkflowRuns(
  octokit: Octokit,
  owner: string,
  repo: string,
  branch: string,
  workflowId: number
): Promise<{ id: number; created_at: string }[]> {
  const { data } = await octokit.rest.actions.listWorkflowRuns({
    owner,
    repo,
    workflow_id: workflowId,
    branch,
  });

  return data.workflow_runs.map(run => ({
    id: run.id,
    created_at: run.created_at,
  }));
}

async function deleteRuns(
  octokit: Octokit,
  owner: string,
  repo: string,
  runs: { id: number; created_at: string }[]
) {
  const sortedRuns = [...runs].sort((a, b) => {
    const timeA = new Date(a.created_at);
    const timeB = new Date(b.created_at);

    return timeA.getTime() - timeB.getTime();
  });

  if (sortedRuns.length > 0) {
    sortedRuns.pop();
  }

  for (const run of sortedRuns) {
    try {
      await octokit.rest.actions.deleteWorkflowRun({
        owner,
        repo,
        run_id: run.id,
      });

      core.info(`Successfully deleted workflow run: ${run.id}`);
    } catch (error) {
      core.error(
        `Failed to dismiss workflow run ${run.id}: ${resolveErrorMessage(error)}`
      );
    }
  }
}
