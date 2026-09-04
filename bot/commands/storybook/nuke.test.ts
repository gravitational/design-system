import { describe, expect, it, vi } from 'vitest';

import {
  isGroup1Reviewer,
  runNukePreviews,
  selectPreviewArtifactsToDelete,
} from './nuke';

vi.mock('@actions/core', () => ({
  info: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
  setFailed: vi.fn(),
  setOutput: vi.fn(),
}));

describe('isGroup1Reviewer', () => {
  it('accepts group 1 reviewers (eu and us)', () => {
    expect(isGroup1Reviewer('ryanclark')).toBe(true);
    expect(isGroup1Reviewer('ravicious')).toBe(true);
    expect(isGroup1Reviewer('avatus')).toBe(true);
    expect(isGroup1Reviewer('kimlisa')).toBe(true);
  });

  it('rejects group 2 reviewers and everyone else', () => {
    expect(isGroup1Reviewer('bl-nero')).toBe(false);
    expect(isGroup1Reviewer('some-random-user')).toBe(false);
    expect(isGroup1Reviewer('')).toBe(false);
  });
});

describe('selectPreviewArtifactsToDelete', () => {
  const artifacts = [
    { id: 1, name: 'storybook-pr-12' },
    { id: 2, name: 'storybook-pr-7' },
    { id: 3, name: 'storybook-main' },
    { id: 4, name: 'storybook-pr-abc' },
    { id: 5, name: 'unrelated' },
    { id: 6, name: 'storybook-pr-' },
  ];

  it('deletes other PR previews but keeps the labeled PR and non-preview artifacts', () => {
    expect(
      selectPreviewArtifactsToDelete(artifacts, 12).map(a => a.id)
    ).toEqual([2]);
  });

  it('deletes every PR preview when the labeled PR has none of its own', () => {
    expect(
      selectPreviewArtifactsToDelete(artifacts, 999).map(a => a.id)
    ).toEqual([1, 2]);
  });
});

interface FakeOctokit {
  paginate: ReturnType<typeof vi.fn>;
  rest: {
    issues: {
      removeLabel: ReturnType<typeof vi.fn>;
      createComment: ReturnType<typeof vi.fn>;
    };
    actions: {
      listArtifactsForRepo: ReturnType<typeof vi.fn>;
      deleteArtifact: ReturnType<typeof vi.fn>;
    };
  };
}

function fakeOctokit(artifacts: { id: number; name: string }[]): FakeOctokit {
  return {
    paginate: vi.fn(() => Promise.resolve(artifacts)),
    rest: {
      issues: {
        removeLabel: vi.fn(() => Promise.resolve()),
        createComment: vi.fn(() => Promise.resolve()),
      },
      actions: {
        listArtifactsForRepo: vi.fn(),
        deleteArtifact: vi.fn(() => Promise.resolve()),
      },
    },
  };
}

describe('runNukePreviews', () => {
  const ctx = { owner: 'o', repo: 'r', pullNumber: 12, actor: 'ryanclark' };

  it('deletes other previews and returns true for a group 1 reviewer', async () => {
    const octokit = fakeOctokit([
      { id: 1, name: 'storybook-pr-12' },
      { id: 2, name: 'storybook-pr-7' },
      { id: 3, name: 'storybook-main' },
    ]);

    const ok = await runNukePreviews(octokit as never, ctx);

    expect(ok).toBe(true);
    expect(octokit.rest.actions.deleteArtifact).toHaveBeenCalledTimes(1);
    expect(octokit.rest.actions.deleteArtifact).toHaveBeenCalledWith({
      owner: 'o',
      repo: 'r',
      artifact_id: 2,
    });
    expect(octokit.rest.issues.removeLabel).not.toHaveBeenCalled();
  });

  it('removes the label, comments, deletes nothing, and returns false for a non-group-1 actor', async () => {
    const octokit = fakeOctokit([{ id: 2, name: 'storybook-pr-7' }]);

    const ok = await runNukePreviews(octokit as never, {
      ...ctx,
      actor: 'mallory',
    });

    expect(ok).toBe(false);
    expect(octokit.rest.actions.deleteArtifact).not.toHaveBeenCalled();
    expect(octokit.rest.issues.removeLabel).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: 'o',
        repo: 'r',
        issue_number: 12,
        name: 'nuke-previews',
      })
    );
    expect(octokit.rest.issues.createComment).toHaveBeenCalledTimes(1);
  });

  it('throws (and does not resolve true) when a targeted deletion fails', async () => {
    const octokit = fakeOctokit([
      { id: 1, name: 'storybook-pr-12' },
      { id: 2, name: 'storybook-pr-7' },
    ]);
    octokit.rest.actions.deleteArtifact = vi.fn(() =>
      Promise.reject(new Error('boom'))
    );

    await expect(runNukePreviews(octokit as never, ctx)).rejects.toThrow(
      /Failed to delete/
    );
  });
});
