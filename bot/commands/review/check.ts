import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import { command, number, option, string } from 'cmd-ts';

import { createOctokit, resolveErrorMessage } from '../../util';
import {
  DESIGN_REVIEWERS,
  getPullRequestContext,
  getReviewerPool,
  getReviewState,
  GROUP1_REVIEWERS,
  type PullRequestContext,
  type ReviewState,
} from './common';

export const checkReviewersCommand = command({
  name: 'check-reviewers',
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

    await runCheckReviewersCommand(octokit, owner, repo, pullNumber);
  },
});

async function runCheckReviewersCommand(
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

  await removeRequestedReviewers(octokit, context, reviewState);
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

  if (context.isRelease || context.isDependabot) {
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

async function removeRequestedReviewers(
  octokit: Octokit,
  context: PullRequestContext,
  reviewState: ReviewState
) {
  const toRemove = reviewState.requestedReviewers.users;

  if (toRemove.length === 0) {
    core.info('No pending review requests to remove');
    return;
  }

  core.info(
    `PR is approved; removing ${toRemove.length} pending review request(s): ` +
      toRemove.join(', ')
  );

  try {
    await octokit.rest.pulls.removeRequestedReviewers({
      owner: context.owner,
      repo: context.repo,
      pull_number: context.pullNumber,
      reviewers: toRemove,
    });

    core.info(`Removed pending review requests: ${toRemove.join(', ')}`);
  } catch (error) {
    core.error(
      `Failed to remove review requests: ${resolveErrorMessage(error)}`
    );
  }
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

    const runs = await listWorkflowRuns(
      octokit,
      context.owner,
      context.repo,
      context.headRef,
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
