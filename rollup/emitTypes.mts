import * as path from 'node:path';

import type { Plugin } from 'rollup';
import ts, { type CompilerOptions } from 'typescript';

interface EmitTypesOptions {
  tsconfig: string;
  cwd: string;
}

export function emitTypes({ cwd, tsconfig }: EmitTypesOptions): Plugin {
  const bundledModules = new Set<string>();

  return {
    name: 'emit-types',
    moduleParsed(moduleInfo) {
      if (!moduleInfo.isExternal && moduleInfo.id) {
        bundledModules.add(path.resolve(moduleInfo.id));
      }
    },
    writeBundle: {
      sequential: true,
      handler() {
        const configFile = ts.readConfigFile(tsconfig, ts.sys.readFile);

        if (configFile.error) {
          throw new Error(
            ts.formatDiagnostic(configFile.error, {
              getCanonicalFileName: f => f,
              getCurrentDirectory: () => cwd,
              getNewLine: () => ts.sys.newLine,
            })
          );
        }

        const bundledFiles = Array.from(bundledModules).filter(
          file => file.endsWith('.ts') || file.endsWith('.tsx')
        );

        if (bundledFiles.length === 0) {
          // eslint-disable-next-line no-console
          console.warn('No TypeScript files found in bundle');

          return;
        }

        const parsedConfig = ts.parseJsonConfigFileContent(
          {
            ...configFile.config,
            compilerOptions: {
              ...(configFile.config as { compilerOptions: CompilerOptions })
                .compilerOptions,
              noEmit: false,
              rootDir: 'src',
              tsBuildInfoFile: '.typescript/tsconfig.release.tsbuildinfo',
            },
            include: undefined,
            files: bundledFiles,
          },
          ts.sys,
          path.dirname(tsconfig)
        );

        if (parsedConfig.errors.length > 0) {
          const formatHost = {
            getCanonicalFileName: (f: string) => f,
            getCurrentDirectory: () => cwd,
            getNewLine: () => ts.sys.newLine,
          };
          throw new Error(
            parsedConfig.errors
              .map(e => ts.formatDiagnostic(e, formatHost))
              .join('\n')
          );
        }

        const program = ts.createProgram(
          parsedConfig.fileNames,
          parsedConfig.options
        );

        const emitResult = program.emit(
          undefined,
          undefined,
          undefined,
          true,
          undefined
        );

        const allDiagnostics = ts
          .getPreEmitDiagnostics(program)
          .concat(emitResult.diagnostics);

        if (allDiagnostics.length > 0) {
          const formatHost = {
            getCanonicalFileName: (f: string) => f,
            getCurrentDirectory: () => cwd,
            getNewLine: () => ts.sys.newLine,
          };

          throw new Error(
            allDiagnostics
              .map(d => ts.formatDiagnostic(d, formatHost))
              .join('\n')
          );
        }
      },
    },
  };
}
