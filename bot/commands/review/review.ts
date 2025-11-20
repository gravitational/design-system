import { subcommands } from 'cmd-ts';

import { assignReviewersCommand } from './assign';
import { checkReviewersCommand } from './check';

export const reviewCommand = subcommands({
  name: 'review',
  cmds: {
    assign: assignReviewersCommand,
    check: checkReviewersCommand,
  },
});
