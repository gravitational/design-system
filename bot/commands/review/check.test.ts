import { describe, expect, it } from 'vitest';

import { validateApprovals } from './check';
import {
  DESIGN_REVIEWERS,
  GROUP1_REVIEWERS,
  GROUP2_REVIEWERS,
  type PullRequestContext,
  type ReviewState,
} from './common';

describe('validateApprovals', () => {
  const baseContext: PullRequestContext = {
    owner: 'gravitational',
    repo: 'design-system',
    headRef: 'feature-branch',
    pullNumber: 1,
    author: 'testuser',
    isDraft: false,
    needsDesignReview: false,
    isRelease: false,
    availableReviewers: {
      group1: GROUP1_REVIEWERS.eu,
      group2: GROUP2_REVIEWERS.eu,
      design: DESIGN_REVIEWERS.eu,
    },
    fallbackReviewers: {
      group1: GROUP1_REVIEWERS.us,
      group2: GROUP2_REVIEWERS.us,
      design: DESIGN_REVIEWERS.us,
    },
  };

  const baseReviewState: ReviewState = {
    humanReviews: [],
    requestedReviewers: {
      users: [],
      teams: [],
    },
    approvedBy: new Set<string>(),
  };

  it('validates with both group1 and group2 approvers', () => {
    const reviewState: ReviewState = {
      ...baseReviewState,
      approvedBy: new Set(['ryanclark', 'bl-nero']),
    };

    const result = validateApprovals(baseContext, reviewState);

    expect(result.isValid).toBe(true);
    expect(result.missingGroups.group1).toBe(false);
    expect(result.missingGroups.group2).toBe(false);
    expect(result.missingGroups.design).toBe(false);
  });

  it('fails validation when missing group2 approval', () => {
    const reviewState: ReviewState = {
      ...baseReviewState,
      approvedBy: new Set(['ryanclark']),
    };

    const result = validateApprovals(baseContext, reviewState);

    expect(result.isValid).toBe(false);
    expect(result.missingGroups.group1).toBe(false);
    expect(result.missingGroups.group2).toBe(true);
  });

  it('fails validation when missing group1 approval', () => {
    const reviewState: ReviewState = {
      ...baseReviewState,
      approvedBy: new Set(['bl-nero']),
    };

    const result = validateApprovals(baseContext, reviewState);

    expect(result.isValid).toBe(false);
    expect(result.missingGroups.group1).toBe(true);
    expect(result.missingGroups.group2).toBe(false);
  });

  it('requires design approval when needs-design-review is true', () => {
    const context: PullRequestContext = {
      ...baseContext,
      needsDesignReview: true,
    };

    const reviewState: ReviewState = {
      ...baseReviewState,
      approvedBy: new Set(['ryanclark', 'bl-nero']),
    };

    const result = validateApprovals(context, reviewState);

    expect(result.isValid).toBe(false);
    expect(result.missingGroups.design).toBe(true);
  });

  it('passes validation with design approval when required', () => {
    const context: PullRequestContext = {
      ...baseContext,
      needsDesignReview: true,
    };

    const reviewState: ReviewState = {
      ...baseReviewState,
      approvedBy: new Set(['ryanclark', 'bl-nero', 'roraback']),
    };

    const result = validateApprovals(context, reviewState);

    expect(result.isValid).toBe(true);
    expect(result.missingGroups.design).toBe(false);
  });

  it('allows release PRs with only group1 approval', () => {
    const context: PullRequestContext = {
      ...baseContext,
      isRelease: true,
    };

    const reviewState: ReviewState = {
      ...baseReviewState,
      approvedBy: new Set(['ryanclark']),
    };

    const result = validateApprovals(context, reviewState);

    expect(result.isValid).toBe(true);
    expect(result.missingGroups.group1).toBe(false);
    expect(result.missingGroups.group2).toBe(false);
  });

  it('excludes PR author from eligible reviewers', () => {
    const context: PullRequestContext = {
      ...baseContext,
      author: 'ryanclark',
    };

    const reviewState: ReviewState = {
      ...baseReviewState,
      approvedBy: new Set(),
    };

    const result = validateApprovals(context, reviewState);

    expect(result.eligibleReviewers.group1).not.toContain('ryanclark');
  });

  it('treats any non-group1/non-design approver as group2', () => {
    const reviewState: ReviewState = {
      ...baseReviewState,
      approvedBy: new Set(['ryanclark', 'someotheruser']),
    };

    const result = validateApprovals(baseContext, reviewState);

    expect(result.isValid).toBe(true);
    expect(result.missingGroups.group2).toBe(false);
  });
});
