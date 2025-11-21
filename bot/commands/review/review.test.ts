import { describe, expect, it, vi } from 'vitest';

import { validateApprovals } from './check';
import {
  DESIGN_REVIEWERS,
  GROUP1_REVIEWERS,
  GROUP2_REVIEWERS,
  type PullRequestContext,
  type ReviewState,
} from './common';

describe('Integration scenarios', () => {
  it('correctly identifies eligible reviewers across time zones', () => {
    vi.setSystemTime(new Date(Date.UTC(2024, 0, 15, 10, 0, 0))); // EU hours

    const context: PullRequestContext = {
      owner: 'gravitational',
      repo: 'design-system',
      headRef: 'feature-branch',
      pullNumber: 1,
      author: 'testuser',
      isDraft: false,
      needsDesignReview: false,
      isRelease: false,
      isDependabot: false,
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

    const reviewState: ReviewState = {
      humanReviews: [],
      requestedReviewers: { users: [], teams: [] },
      approvedBy: new Set(),
    };

    const validation = validateApprovals(context, reviewState);

    expect(validation.eligibleReviewers.group1).toEqual(['ryanclark']);
    expect(validation.eligibleReviewers.group2).toContain('bl-nero');
    expect(validation.eligibleReviewers.group2).toContain('ravicious');
    expect(validation.eligibleReviewers.group2).toContain('nicholasmarais1158');

    vi.useRealTimers();
  });

  it('handles PR author being in reviewer groups correctly', () => {
    const context: PullRequestContext = {
      owner: 'gravitational',
      repo: 'design-system',
      headRef: 'feature-branch',
      pullNumber: 1,
      author: 'bl-nero',
      isDraft: false,
      needsDesignReview: false,
      isRelease: false,
      isDependabot: false,
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

    const reviewState: ReviewState = {
      humanReviews: [],
      requestedReviewers: { users: [], teams: [] },
      approvedBy: new Set(['ryanclark']),
    };

    const validation = validateApprovals(context, reviewState);

    expect(validation.eligibleReviewers.group2).not.toContain('bl-nero');
    expect(validation.eligibleReviewers.group2).toContain('ravicious');
    expect(validation.missingGroups.group2).toBe(true);
  });
});
