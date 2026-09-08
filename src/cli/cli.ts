import { spawn } from 'node:child_process';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { addComments } from './addComments';

const themePath = join(import.meta.dirname, '../themes/teleport/theme.js');

process.argv.push(themePath);

/**
 * This script runs the Chakra UI CLI to generate type definitions for a custom theme
 * and then adds JSDoc comments to the generated types. It adds the correct path to the
 * theme file as an argument to the CLI command.
 */
async function main() {
  try {
    const chakraCliIndexPath = fileURLToPath(
      import.meta.resolve('@chakra-ui/cli')
    );
    const chakraCliPath = resolve(chakraCliIndexPath, '../../../bin/index.js');

    await new Promise<void>((resolvePromise, reject) => {
      const child = spawn(
        process.execPath,
        [chakraCliPath, 'typegen', themePath],
        {
          cwd: import.meta.dirname,
          stdio: 'inherit',
        }
      );

      child.on('exit', code => {
        if (code === 0) {
          resolvePromise();
        } else {
          reject(new Error(`chakra typegen exited with code ${code}`));
        }
      });

      child.on('error', reject);
    });

    await addComments();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error running Chakra UI CLI:', error);

    process.exit(1);
  }
}

void main();
