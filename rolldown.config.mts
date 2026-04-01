import { resolve } from 'node:path';

import { defineConfig } from 'rolldown';
import copy from 'rollup-plugin-copy';

import packageJson from './package.json' with { type: 'json' };
import { emitTypes } from './rolldown/emitTypes.mts';
import { generatePackageJson } from './rolldown/generatePackageJson.mts';

const deps = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
  'typescript',
];

const external = deps.length ? new RegExp(`^(${deps.join('|')})`) : undefined;

const tsconfig = resolve(import.meta.dirname, 'tsconfig.build.json');

export default defineConfig([
  // Main library build
  {
    input: 'src/index.ts',
    output: {
      format: 'es',
      exports: 'named',
      entryFileNames: '[name].js',
      dir: resolve(import.meta.dirname, 'dist'),
      preserveModules: true,
      preserveModulesRoot: 'src',
      sourcemap: true,
    },
    external,
    plugins: [
      emitTypes({
        cwd: import.meta.dirname,
        tsconfig,
      }),
      generatePackageJson({
        cwd: import.meta.dirname,
        packageJson,
      }),
      copy({
        targets: [{ src: 'src/ubuntu.css', dest: 'dist' }],
      }),
    ],
    onwarn(warning, warn) {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return;
      }
      warn(warning);
    },
  },
  // CLI build
  {
    input: 'src/cli/cli.ts',
    output: {
      file: resolve(import.meta.dirname, 'dist/cli/cli.js'),
      format: 'es',
      banner: '#!/usr/bin/env node',
    },
    external: [/^node:/, 'typescript'],
    platform: 'node',
    plugins: [],
    onwarn(warning, warn) {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return;
      }
      warn(warning);
    },
  },
]);
