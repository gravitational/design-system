import * as core from '@actions/core';
import { run, subcommands } from 'cmd-ts';

import { changesetCommand } from './commands/changeset/changeset';
import { releaseCommand } from './commands/release/release';
import { reviewCommand } from './commands/review/review';
import { storybookCommand } from './commands/storybook/storybook';
import { resolveErrorMessage } from './util';

const bot = subcommands({
  name: 'bot',
  cmds: {
    changeset: changesetCommand,
    release: releaseCommand,
    review: reviewCommand,
    storybook: storybookCommand,
  },
});

void run(bot, process.argv.slice(2)).catch((err: unknown) => {
  core.setFailed(`Bot failed: ${resolveErrorMessage(err)}`);
});
