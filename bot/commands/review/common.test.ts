import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { isEUWorkingHours } from '../../util';
import {
  getReviewerPool,
  processReviewState,
  type PullRequestContext,
  type Review,
} from './common';

vi.mock('@actions/core', () => ({
  info: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  setFailed: vi.fn(),
}));

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
