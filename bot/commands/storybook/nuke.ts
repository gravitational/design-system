import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';
import { command, number, option, string } from 'cmd-ts';

import { createOctokit, resolveErrorMessage } from '../../util';
import { GROUP1_REVIEWERS } from '../review/common';

const NUKE_LABEL = 'nuke-previews';
const PREVIEW_ARTIFACT = /^storybook-pr-(\d+)$/;

export function isGroup1Reviewer(login: string): boolean {
  return [...GROUP1_REVIEWERS.eu, ...GROUP1_REVIEWERS.us].includes(login);
}

export function selectPreviewArtifactsToDelete<T extends { name: string }>(
  artifacts: T[],
  keepPullNumber: number
): T[] {
  return artifacts.filter(artifact => {
    const match = PREVIEW_ARTIFACT.exec(artifact.name);
    return match != null && Number(match[1]) !== keepPullNumber;
  });
}

interface NukeContext {
  owner: string;
  repo: string;
  pullNumber: number;
  actor: string;
}

export async function runNukePreviews(
  octokit: Octokit,
  { owner, repo, pullNumber, actor }: NukeContext
): Promise<boolean> {
  if (!isGroup1Reviewer(actor)) {
    core.warning(
      `${actor} is not a group 1 reviewer; ignoring ${NUKE_LABEL} on #${pullNumber}.`
    );
    await octokit.rest.issues
      .removeLabel({ owner, repo, issue_number: pullNumber, name: NUKE_LABEL })
      .catch((err: unknown) => {
        core.warning(`Failed to remove label: ${resolveErrorMessage(err)}`);
      });
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pullNumber,
      body: `🚫 \`${NUKE_LABEL}\` can only be applied by a group 1 reviewer, so I've removed it. No previews were changed.`,
    });
    return false;
  }

  const artifacts = await octokit.paginate(
    octokit.rest.actions.listArtifactsForRepo,
    { owner, repo, per_page: 100 }
  );

  const toDelete = selectPreviewArtifactsToDelete(artifacts, pullNumber);
  core.info(
    `Deleting ${toDelete.length} preview artifact(s); keeping storybook-pr-${pullNumber}.`
  );

  const failed: string[] = [];
  for (const artifact of toDelete) {
    try {
      await octokit.rest.actions.deleteArtifact({
        owner,
        repo,
        artifact_id: artifact.id,
      });
      core.info(`Deleted ${artifact.name} (id ${artifact.id}).`);
    } catch (err: unknown) {
      failed.push(`${artifact.name} (${artifact.id})`);
      core.warning(
        `Failed to delete ${artifact.name} (${artifact.id}): ${resolveErrorMessage(err)}`
      );
    }
  }

  if (failed.length > 0) {
    throw new Error(
      `Failed to delete ${failed.length} preview artifact(s): ${failed.join(', ')}. Aborting before redeploy so they are not republished.`
    );
  }

  return true;
}

export const storybookNukeCommand = command({
  name: 'nuke-previews',
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
      description:
        'Pull request the label was applied to (its preview is kept)',
    }),
    actor: option({
      type: string,
      long: 'actor',
      short: 'a',
      description: 'GitHub login that applied the label',
    }),
  },
  handler: async ({ owner, repo, pullNumber, actor }) => {
    const octokit = createOctokit();
    const authorized = await runNukePreviews(octokit, {
      owner,
      repo,
      pullNumber,
      actor,
    });
    core.setOutput('authorized', authorized ? 'true' : 'false');
  },
});
