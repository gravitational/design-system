import { resolve } from 'node:path';

import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import type { RollupOptions } from 'rollup';
import copy from 'rollup-plugin-copy';
import esbuild from 'rollup-plugin-esbuild';

import packageJson from './package.json' with { type: 'json' };
import { emitTypes } from './rollup/emitTypes.mts';
import { generatePackageJson } from './rollup/generatePackageJson.mts';

const deps = [
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
  'typescript',
];

const external = deps.length ? new RegExp(`^(${deps.join('|')})`) : undefined;

const tsconfig = resolve(import.meta.dirname, 'tsconfig.build.json');

const config: RollupOptions[] = [
  // Main library build
  {
    input: 'src/index.ts',
    output: [
      {
        format: 'es',
        exports: 'named',
        entryFileNames: '[name].js',
        dir: resolve(import.meta.dirname, 'dist'),
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    external,
    plugins: [
      nodeResolve({
        preferBuiltins: true,
        dedupe: ['react'],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        tsconfig,
        platform: 'browser',
      }),
      emitTypes({
        cwd: import.meta.dirname,
        tsconfig,
      }),
      generatePackageJson({
        cwd: import.meta.dirname,
        packageJson,
      }),
      copy({
        targets: [{ src: 'src/assets', dest: 'dist' }],
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
    plugins: [
      nodeResolve({
        preferBuiltins: true,
      }),
      commonjs(),
      esbuild({
        tsconfig,
        platform: 'node',
        target: 'node22',
      }),
    ],
    onwarn(warning, warn) {
      if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
        return;
      }
      warn(warning);
    },
  },
];

export { config as default };
