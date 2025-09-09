import { writeFile } from 'node:fs/promises';
import * as path from 'node:path';

import type { Plugin } from 'rollup';

interface PackageJson {
  name: string;
  version: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  bin?: Record<string, string>;
  storybook?: Record<string, string>;
  exports?: Record<string, unknown>;
}

interface GeneratePackageJsonOptions {
  cwd: string;
  packageJson: PackageJson;
}

/**
 * A Rollup plugin to generate a package.json file in the output directory.
 * This is useful so that the built package can be published with only the necessary fields.
 */
export function generatePackageJson({
  cwd,
  packageJson,
}: GeneratePackageJsonOptions): Plugin {
  return {
    name: 'generate-package-json',
    writeBundle: {
      sequential: true,
      async handler() {
        const distPath = path.join(cwd, 'dist');
        const packageJsonPath = path.join(distPath, 'package.json');

        const nextPackageJson: PackageJson = {
          bin: packageJson.bin,
          name: packageJson.name,
          version: packageJson.version,
          dependencies: packageJson.dependencies,
          peerDependencies: packageJson.peerDependencies,
          storybook: packageJson.storybook,
          exports: {
            '.': {
              import: {
                types: './index.d.ts',
                default: './index.js',
              },
            },
          },
        };

        await writeFile(
          packageJsonPath,
          JSON.stringify(nextPackageJson, null, 2)
        );
      },
    },
  };
}
