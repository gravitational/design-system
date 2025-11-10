import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DESIGN_REVIEWERS,
  getReviewerPool,
  GROUP1_REVIEWERS,
  GROUP2_REVIEWERS,
  isEUWorkingHours,
  processReviewState,
  selectRandomReviewers,
  validateApprovals,
  type PullRequestContext,
  type Review,
  type ReviewState,
} from './review';

vi.mock('@actions/core', () => ({
  info: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  setFailed: vi.fn(),
}));

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

describe('selectRandomReviewers', () => {
  it('selects one reviewer from each group when both available', () => {
    const eligibleGroup1 = ['ryanclark'];
    const eligibleGroup2 = ['bl-nero', 'ravicious', 'nicholasmarais1158'];

    const reviewers = selectRandomReviewers(
      eligibleGroup1,
      eligibleGroup2,
      false
    );

    expect(reviewers).toContain('ryanclark');
    expect(reviewers.length).toBe(2);
    expect(eligibleGroup2).toContain(reviewers[1]);
  });

  it('selects up to 2 from group2 when no group1 available', () => {
    const eligibleGroup1: string[] = [];
    const eligibleGroup2 = ['bl-nero', 'ravicious', 'nicholasmarais1158'];

    const reviewers = selectRandomReviewers(
      eligibleGroup1,
      eligibleGroup2,
      false
    );

    expect(reviewers.length).toBeLessThanOrEqual(2);
    expect(reviewers.every(r => eligibleGroup2.includes(r))).toBe(true);
  });

  it('returns empty array when no eligible reviewers', () => {
    const reviewers = selectRandomReviewers([], [], false);

    expect(reviewers).toEqual([]);
  });

  it('only selects from group1 for release PRs', () => {
    const eligibleGroup1 = ['ryanclark'];
    const eligibleGroup2 = ['bl-nero', 'ravicious'];

    const reviewers = selectRandomReviewers(
      eligibleGroup1,
      eligibleGroup2,
      true
    );

    expect(reviewers).toEqual(['ryanclark']);
  });

  it('returns empty array for release PRs when no group1 available', () => {
    const eligibleGroup1: string[] = [];
    const eligibleGroup2 = ['bl-nero', 'ravicious'];

    const reviewers = selectRandomReviewers(
      eligibleGroup1,
      eligibleGroup2,
      true
    );

    expect(reviewers).toEqual([]);
  });
});

describe('isEUWorkingHours', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  function mockUTCHours(hours: number) {
    const year = 2024;
    const month = 0; // January
    const day = 15;
    const date = new Date(Date.UTC(year, month, day, hours, 0, 0));
    vi.setSystemTime(date);
  }

  it('returns true for EU working hours (10 UTC)', () => {
    mockUTCHours(10);
    expect(isEUWorkingHours()).toBe(true);
  });

  it('returns true at start of EU working hours (6 UTC)', () => {
    mockUTCHours(6);
    expect(isEUWorkingHours()).toBe(true);
  });

  it('returns true at 17 UTC (still EU hours)', () => {
    mockUTCHours(17);
    expect(isEUWorkingHours()).toBe(true);
  });

  it('returns false at 18 UTC (US hours)', () => {
    mockUTCHours(18);
    expect(isEUWorkingHours()).toBe(false);
  });

  it('returns false at 20 UTC (US hours)', () => {
    mockUTCHours(20);
    expect(isEUWorkingHours()).toBe(false);
  });

  it('returns false at 5 UTC (before EU hours)', () => {
    mockUTCHours(5);
    expect(isEUWorkingHours()).toBe(false);
  });
});

describe('getReviewerPool', () => {
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
      group1: ['ryanclark'],
      group2: ['bl-nero', 'ravicious'],
      design: [],
    },
    fallbackReviewers: {
      group1: [],
      group2: ['rudream', 'mcbattirola'],
      design: ['roraback'],
    },
  };

  it('returns available reviewers when present', () => {
    const result = getReviewerPool(baseContext, 'group1');
    expect(result).toEqual(['ryanclark']);
  });

  it('returns fallback reviewers when available is empty', () => {
    const result = getReviewerPool(baseContext, 'design');
    expect(result).toEqual(['roraback']);
  });

  it('returns empty array when both available and fallback are empty', () => {
    const context: PullRequestContext = {
      ...baseContext,
      availableReviewers: {
        ...baseContext.availableReviewers,
        group1: [],
      },
    };

    const result = getReviewerPool(context, 'group1');
    expect(result).toEqual([]);
  });
});

describe('processReviewState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('only includes approvals from Teleport team members', () => {
    const reviews: Review[] = [
      {
        id: 1,
        state: 'APPROVED',
        user: { login: 'tigrato' },
      },
      {
        id: 2,
        state: 'APPROVED',
        user: { login: 'external-user-1' },
      },
      {
        id: 3,
        state: 'APPROVED',
        user: { login: 'external-user-2' },
      },
    ];

    const result = processReviewState(reviews, [], [], 'testuser');

    // Only tigrato (GRAVITATIONAL_MEMBERS) should be included
    expect(result.approvedBy.has('tigrato')).toBe(true);

    // Others should be excluded
    expect(result.approvedBy.has('external-user-1')).toBe(false);
    expect(result.approvedBy.has('external-user-2')).toBe(false);

    expect(result.approvedBy.size).toBe(1);
  });

  it('filters out bot reviews', () => {
    const reviews: Review[] = [
      {
        id: 1,
        state: 'APPROVED',
        user: { login: 'dependabot[bot]' },
      },
      {
        id: 2,
        state: 'APPROVED',
        user: { login: 'tigrato' },
      },
    ];

    const result = processReviewState(reviews, [], [], 'testuser');

    expect(result.approvedBy.has('dependabot[bot]')).toBe(false);
    expect(result.approvedBy.has('tigrato')).toBe(true);
    expect(result.approvedBy.size).toBe(1);
  });

  it('filters out PR author reviews', () => {
    const reviews: Review[] = [
      {
        id: 1,
        state: 'APPROVED',
        user: { login: 'pr-author' },
      },
      {
        id: 2,
        state: 'APPROVED',
        user: { login: 'tigrato' },
      },
    ];

    const result = processReviewState(reviews, [], [], 'pr-author');

    expect(result.approvedBy.has('pr-author')).toBe(false);
    expect(result.approvedBy.has('tigrato')).toBe(true);
    expect(result.approvedBy.size).toBe(1);
  });

  it('logs warning for rejected approvals', async () => {
    const core = vi.mocked(await import('@actions/core'));

    const reviews: Review[] = [
      {
        id: 1,
        state: 'APPROVED',
        user: { login: 'external-user' },
      },
    ];

    processReviewState(reviews, [], [], 'testuser');

    expect(core.warning).toHaveBeenCalledWith(
      'Ignoring approval from external-user - not a Teleport team member.'
    );
  });

  it('only counts APPROVED reviews', () => {
    const reviews: Review[] = [
      {
        id: 1,
        state: 'COMMENTED',
        user: { login: 'tigrato' },
      },
      {
        id: 2,
        state: 'CHANGES_REQUESTED',
        user: { login: 'tigrato' },
      },
      {
        id: 3,
        state: 'APPROVED',
        user: { login: 'tigrato' },
      },
    ];

    const result = processReviewState(reviews, [], [], 'testuser');

    expect(result.approvedBy.has('tigrato')).toBe(true);
    expect(result.approvedBy.size).toBe(1);
  });

  it('handles requested reviewers correctly', () => {
    const reviews: Review[] = [];
    const requestedUsers = ['user1', 'user2', 'pr-author'];
    const requestedTeams = ['team1', 'team2'];

    const result = processReviewState(
      reviews,
      requestedUsers,
      requestedTeams,
      'pr-author'
    );

    expect(result.requestedReviewers.users).toEqual(['user1', 'user2']);
    expect(result.requestedReviewers.teams).toEqual(['team1', 'team2']);
  });

  it('creates proper human reviews list', () => {
    const reviews: Review[] = [
      {
        id: 1,
        state: 'APPROVED',
        user: { login: 'tigrato' },
      },
      {
        id: 2,
        state: 'CHANGES_REQUESTED',
        user: { login: 'tigrato' },
      },
      {
        id: 3,
        state: 'COMMENTED',
        user: { login: 'tigrato' },
      },
    ];

    const result = processReviewState(reviews, [], [], 'testuser');

    expect(result.humanReviews).toHaveLength(1);
    expect(result.humanReviews[0]).toEqual({
      id: 2,
      state: 'CHANGES_REQUESTED',
      user: 'tigrato',
    });
  });
});

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
