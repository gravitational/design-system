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

        const srcDir = path.resolve(cwd, 'src');
        const baseCompilerOptions: ts.CompilerOptions = {
          ...(configFile.config as { compilerOptions: CompilerOptions })
            .compilerOptions,
          moduleResolution: ts.ModuleResolutionKind.Bundler,
          baseUrl: cwd,
        };

        const allFiles = collectAllImportedFiles(
          bundledFiles,
          baseCompilerOptions,
          srcDir
        );

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
            files: allFiles,
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

function collectAllImportedFiles(
  entryFiles: string[],
  compilerOptions: ts.CompilerOptions,
  srcDir: string
) {
  const allFiles = new Set<string>(entryFiles);
  const toProcess = [...entryFiles];

  while (toProcess.length > 0) {
    const file = toProcess.pop();

    if (!file || !ts.sys.fileExists(file)) {
      continue;
    }

    const sourceText = ts.sys.readFile(file);
    if (!sourceText) {
      continue;
    }

    const sourceFile = ts.createSourceFile(
      file,
      sourceText,
      ts.ScriptTarget.Latest,
      true
    );

    ts.forEachChild(sourceFile, node => {
      if (
        (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const moduleName = node.moduleSpecifier.text;

        if (moduleName.startsWith('.')) {
          const resolvedModule = ts.resolveModuleName(
            moduleName,
            file,
            compilerOptions,
            ts.sys
          );

          if (resolvedModule.resolvedModule) {
            const resolvedPath = path.resolve(
              resolvedModule.resolvedModule.resolvedFileName
            );

            if (
              resolvedPath.startsWith(srcDir) &&
              !allFiles.has(resolvedPath)
            ) {
              allFiles.add(resolvedPath);
              toProcess.push(resolvedPath);
            }
          }
        }
      }
    });
  }

  return Array.from(allFiles);
}
