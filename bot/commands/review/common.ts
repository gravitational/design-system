import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

import { isEUWorkingHours } from '../../util';
import { GRAVITATIONAL_MEMBERS } from './team';

interface HumanReview {
  id: number;
  state: string;
  user?: string;
}

export interface ReviewState {
  humanReviews: HumanReview[];
  requestedReviewers: {
    users: string[];
    teams: string[];
  };
  approvedBy: Set<string>;
}

export interface Review {
  id: number;
  state: string;
  user?: {
    login: string;
  };
}

interface ReviewerDefinition {
  eu: string[];
  us: string[];
}

export const GROUP1_REVIEWERS: ReviewerDefinition = {
  eu: ['ryanclark'],
  us: [],
};

export const GROUP2_REVIEWERS: ReviewerDefinition = {
  eu: ['bl-nero', 'ravicious', 'nicholasmarais1158'],
  us: ['rudream', 'mcbattirola', 'michellescripts'],
};

export const DESIGN_REVIEWERS: ReviewerDefinition = {
  eu: [],
  us: ['roraback'],
};

export interface PullRequestContext {
  owner: string;
  repo: string;
  headRef: string;
  pullNumber: number;
  author: string;
  isDraft: boolean;
  needsDesignReview: boolean;
  isRelease: boolean;
  availableReviewers: {
    group1: string[];
    group2: string[];
    design: string[];
  };
  fallbackReviewers: {
    group1: string[];
    group2: string[];
    design: string[];
  };
}

export async function getPullRequestContext(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<PullRequestContext> {
  const { data: pullRequest } = await octokit.rest.pulls.get({
    owner,
    repo,
    pull_number: pullNumber,
  });

  const isEU = isEUWorkingHours();

  const availableReviewers = {
    group1: isEU ? GROUP1_REVIEWERS.eu : GROUP1_REVIEWERS.us,
    group2: isEU ? GROUP2_REVIEWERS.eu : GROUP2_REVIEWERS.us,
    design: isEU ? DESIGN_REVIEWERS.eu : DESIGN_REVIEWERS.us,
  };

  const fallbackReviewers = {
    group1: isEU ? GROUP1_REVIEWERS.us : GROUP1_REVIEWERS.eu,
    group2: isEU ? GROUP2_REVIEWERS.us : GROUP2_REVIEWERS.eu,
    design: isEU ? DESIGN_REVIEWERS.us : DESIGN_REVIEWERS.eu,
  };

  return {
    owner,
    repo,
    pullNumber,
    headRef: pullRequest.head.ref,
    author: pullRequest.user.login,
    isDraft: pullRequest.draft ?? false,
    needsDesignReview: pullRequest.labels.some(
      l => l.name === 'needs-design-review'
    ),
    isRelease: pullRequest.user.login === 'design-system-release[bot]',
    availableReviewers,
    fallbackReviewers,
  };
}

export async function getReviewState(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  prAuthor: string
): Promise<ReviewState> {
  const [reviews, requestedReviewers] = await Promise.all([
    octokit.rest.pulls.listReviews({
      owner,
      repo,
      pull_number: pullNumber,
    }),
    octokit.rest.pulls.listRequestedReviewers({
      owner,
      repo,
      pull_number: pullNumber,
    }),
  ]);

  return processReviewState(
    reviews.data as Review[],
    requestedReviewers.data.users.map(u => u.login),
    requestedReviewers.data.teams.map(t => t.name),
    prAuthor
  );
}

export function processReviewState(
  reviews: Review[],
  requestedUsers: string[],
  requestedTeams: string[],
  prAuthor: string
): ReviewState {
  const seenReviewers = new Set<string>();

  // Process reviews from the end first (latest reviews first)
  const humanReviews = reviews
    .slice()
    .reverse()
    .filter(
      review =>
        review.user &&
        !review.user.login.includes('[bot]') &&
        review.user.login !== prAuthor &&
        (review.state === 'APPROVED' || review.state === 'CHANGES_REQUESTED')
    )
    .filter(review => {
      if (!review.user?.login) {
        return false;
      }

      if (seenReviewers.has(review.user.login)) {
        return false;
      }

      seenReviewers.add(review.user.login);

      return true;
    })
    .map(r => ({
      id: r.id,
      state: r.state,
      user: r.user?.login,
    }));

  const approvedBy = new Set(
    humanReviews
      .filter(r => {
        if (r.state !== 'APPROVED' || !r.user) {
          return false;
        }

        if (!GRAVITATIONAL_MEMBERS.includes(r.user)) {
          core.warning(
            `Ignoring approval from ${r.user} - not a Teleport team member.`
          );

          return false;
        }

        return true;
      })
      .map(r => r.user)
      .filter(Boolean) as string[]
  );

  const users = requestedUsers.filter(u => u !== prAuthor);
  const teams = requestedTeams;

  return {
    humanReviews: humanReviews.map(r => ({
      id: r.id,
      state: r.state,
      user: r.user,
    })),
    requestedReviewers: {
      users,
      teams,
    },
    approvedBy,
  };
}

export function getReviewerPool(
  context: PullRequestContext,
  group: 'group1' | 'group2' | 'design'
): string[] {
  const available = context.availableReviewers[group];
  if (available.length > 0) {
    return available;
  }

  core.info(`No available reviewers in ${group}, falling back to other region`);

  return context.fallbackReviewers[group];
}
