import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

export function resolveErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  if (typeof err === 'string') {
    return err;
  }
  return 'An unknown error occurred';
}

export function isEUWorkingHours() {
  const hours = new Date().getUTCHours();

  return hours >= 6 && hours < 18;
}

export function createOctokit(): Octokit {
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    core.error('GITHUB_TOKEN environment variable is required');
    process.exit(1);
  }

  return new Octokit({
    auth: githubToken,
  });
}
