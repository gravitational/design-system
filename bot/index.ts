import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

import { runChangesetCommand } from './changeset.ts';
import { runReleaseCommand } from './release.ts';
import { runReviewerCommand } from './review.ts';
import { runStorybookCommand } from './storybook.ts';
import { resolveErrorMessage } from './util.ts';

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 4) {
    core.error('Usage: pnpm bot <command> <owner> <repo> <pr-number> [action]');
    core.error('Commands: changeset, reviewer, storybook');
    core.error('Examples:');
    core.error(
      '  pnpm bot changeset gravitational design-system 1 synchronize'
    );
    core.error('  pnpm bot reviewer gravitational design-system 1');
    core.error('  pnpm bot storybook gravitational design-system 1');
    process.exit(1);
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    core.error('GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  const octokit = new Octokit({
    auth: githubToken,
  });

  const [command, owner, repo, prNumber, action] = args;

  if (command === 'release') {
    await runReleaseCommand(octokit, {
      owner,
      repo,
      version: args[2],
      tar_gz_path: args[3],
    });

    return;
  }

  const pullNumber = parseInt(prNumber, 10);
  if (isNaN(pullNumber)) {
    core.error('PR number must be a valid number');
    process.exit(1);
  }

  try {
    switch (command) {
      case 'changeset':
        if (!action) {
          core.error('Action is required for changeset command');
          process.exit(1);
        }

        await runChangesetCommand(octokit, {
          owner,
          repo,
          pull_number: pullNumber,
          action,
        });

        break;

      case 'reviewer':
        await runReviewerCommand(octokit, {
          owner,
          repo,
          pull_number: pullNumber,
        });

        break;

      case 'storybook':
        await runStorybookCommand(octokit, {
          owner,
          repo,
          pull_number: pullNumber,
        });

        break;

      default:
        core.error(`Unknown command: ${command}`);
        core.error('Available commands: changeset, reviewer, storybook');
        process.exit(1);
    }
  } catch (err) {
    core.setFailed(`Bot failed: ${resolveErrorMessage(err)}`);
  }
}

main().catch((err: unknown) => {
  core.setFailed(`Bot failed: ${resolveErrorMessage(err)}`);
});
