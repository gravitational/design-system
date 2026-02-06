import { readdir, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { formatString } from '../../utils/writeFormattedFile';
import type { ComponentEntry, ComponentProp } from '../components/PropTypes';
import { PropsGenerator } from './generator';

const ROOT = resolve(import.meta.dirname, '../../..');
const COMPONENTS_DIR = resolve(ROOT, 'src/components');
const OUTPUT_FILE = resolve(ROOT, 'src/storybook/props/generated.json');
const TSCONFIG_PATH = resolve(ROOT, 'tsconfig.build.json');

type ComponentPropWithoutSourceFile = Omit<ComponentProp, 'sourceFile'>;

interface ComponentEntryWithoutPropsSourceFile
  extends Omit<ComponentEntry, 'props'> {
  props: ComponentPropWithoutSourceFile[];
}

async function run() {
  const componentFiles = await findComponentFiles(COMPONENTS_DIR);

  const generator = new PropsGenerator(ROOT, TSCONFIG_PATH, componentFiles);

  const components: ComponentEntryWithoutPropsSourceFile[] = [];

  for (const sourceFile of generator.getSourceFiles()) {
    if (!componentFiles.includes(sourceFile.fileName)) {
      continue;
    }

    const discovered = generator.discoverExportedPropsTypes(sourceFile);

    for (const component of discovered) {
      const resolvedProps = generator.resolvePropsType(
        component.symbol,
        sourceFile
      );

      const filteredProps = resolvedProps.filter(
        prop =>
          shouldIncludeSourceFile(prop.sourceFile) &&
          shouldIncludeProp(prop.name)
      );

      const refType = generator.extractRefType(component.symbol, sourceFile);

      process.stdout.write(
        `\x1b[2mProcessing component: ${component.name}\x1b[0m\n`
      );

      await prettierAllExpandedTypes(filteredProps);

      const sortedProps = filteredProps.toSorted((a, b) =>
        a.name.localeCompare(b.name)
      );

      const entry: ComponentEntryWithoutPropsSourceFile = {
        name: component.name,
        props: sortedProps.map(prop => ({
          ...prop,
          sourceFile: undefined,
        })),
        ref: refType,
      };

      components.push(entry);
    }
  }

  const sortedComponents = components.toSorted((a, b) =>
    a.name.localeCompare(b.name)
  );

  await writeFile(
    OUTPUT_FILE,
    JSON.stringify(sortedComponents, null, 2),
    'utf-8'
  );

  process.stdout.write('\x1b[32mComplete\x1b[0m\n');
}

run().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`\x1b[31mError: ${message}\x1b[0m\n`);
  process.exit(1);
});

async function findComponentFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    return files;
  }

  for (const entry of entries) {
    const fullPath = resolve(dir, entry);
    const fileStat = await stat(fullPath);

    if (fileStat.isDirectory()) {
      files.push(...(await findComponentFiles(fullPath)));

      continue;
    }

    if (
      entry.endsWith('.tsx') &&
      !entry.includes('.stories.') &&
      !entry.includes('.test.')
    ) {
      files.push(fullPath);
    }
  }

  return files.toSorted((a, b) => a.localeCompare(b));
}

async function prettierAllExpandedTypes(props: ComponentProp[]) {
  for (const prop of props) {
    if (prop.typeInfo.kind === 'reference' && prop.typeInfo.expanded) {
      const formatted = await formatString(
        `type t = ${prop.typeInfo.expanded};`
      );

      prop.typeInfo.expanded = formatted
        .replace(/^type t = /, '')
        .replace(/;[\s\r\n]*$/, '');
    }
  }
}

const ignoredProps = new Set(['key', 'ref', '__css', 'css', 'recipe']);

function shouldIncludeProp(propName: string) {
  return !ignoredProps.has(propName);
}

function shouldIncludeSourceFile(sourceFile: string | null) {
  if (!sourceFile) {
    return false;
  }

  if (!sourceFile.includes('/node_modules/')) {
    return true;
  }

  const chakraTypes = [
    'styled-system/generated/recipes.gen.d.ts',
    'types/components/',
    '@ark-ui/react/',
    '@zag-js/',
  ];

  return chakraTypes.some(fragment => sourceFile.includes(fragment));
}
