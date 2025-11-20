import { describe, expect, it, vi } from 'vitest';

import { selectRandomReviewers } from './assign';

vi.mock('@actions/core', () => ({
  info: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  setFailed: vi.fn(),
}));

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
