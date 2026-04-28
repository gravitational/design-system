import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { formatString } from '../../utils/writeFormattedFile';
import type { ComponentEntry, ComponentProp } from '../components/PropTypes';
import { PropsGenerator } from './generator';

const ROOT = resolve(import.meta.dirname, '../../..');
const COMPONENTS_DIR = resolve(ROOT, 'src/components');
const OUTPUT_FILE = resolve(ROOT, 'src/storybook/props/generated.json');
const TSCONFIG_PATH = resolve(ROOT, 'tsconfig.build.json');

type ComponentPropWithoutSourceFile = Omit<ComponentProp, 'sourceFile'>;

interface ComponentEntryWithoutPropsSourceFile extends Omit<
  ComponentEntry,
  'props'
> {
  props: ComponentPropWithoutSourceFile[];
}

async function run() {
  const componentFiles = await findComponentFiles(COMPONENTS_DIR);

  const generator = new PropsGenerator(ROOT, TSCONFIG_PATH, componentFiles);

  const components: ComponentEntryWithoutPropsSourceFile[] = [];
  const seenSymbols = new Set<unknown>();
  const seenNames = new Set<string>();
  const namespaceTypes = new Map<string, Set<string>>();

  // Pass 1: collect every namespace's exported type names so we can qualify
  // bare references in prop types before formatting them.
  for (const sourceFile of generator.getSourceFiles()) {
    if (!componentFiles.includes(sourceFile.fileName)) {
      continue;
    }

    for (const [ns, typeNames] of generator.collectNamespaceTypes(sourceFile)) {
      const existing = namespaceTypes.get(ns) ?? new Set<string>();
      for (const t of typeNames) {
        existing.add(t);
      }
      namespaceTypes.set(ns, existing);
    }
  }

  // Pass 2: discover components, qualify types, format expansions.
  for (const sourceFile of generator.getSourceFiles()) {
    if (!componentFiles.includes(sourceFile.fileName)) {
      continue;
    }

    const discovered = generator.discoverExportedPropsTypes(sourceFile);

    for (const component of discovered) {
      if (seenSymbols.has(component.symbol)) {
        continue;
      }
      if (seenNames.has(component.name)) {
        continue;
      }

      seenSymbols.add(component.symbol);
      seenNames.add(component.name);

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

      qualifyPropsForComponent(component.name, filteredProps, namespaceTypes);
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

  const rendered = JSON.stringify(sortedComponents, null, 2);
  const checkMode = process.argv.includes('--check');

  if (checkMode) {
    const existing = await readFile(OUTPUT_FILE, 'utf-8').catch(() => null);

    if (existing?.trimEnd() !== rendered.trimEnd()) {
      process.stderr.write(
        `\x1b[31mOut of date: ${OUTPUT_FILE}\nRun \`pnpm generate-props\` and commit the result.\x1b[0m\n`
      );
      process.exit(1);
    }
  } else {
    await writeFile(OUTPUT_FILE, rendered, 'utf-8');
  }

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

    // Skip files that are consumed internally by the namespace aggregator
    // at `index.ts`: the flat `<folder>.ts` source-of-truth file and the
    // renamed re-exports in `namespace.ts`. They're picked up transitively
    // when `index.ts` is scanned.
    const folder = dir.split('/').pop() ?? '';
    const skipped =
      entry === 'recipe.ts' ||
      entry === 'namespace.ts' ||
      entry === `${folder}.ts`;

    if (
      (entry.endsWith('.tsx') || entry.endsWith('.ts')) &&
      !entry.includes('.stories.') &&
      !entry.includes('.test.') &&
      !skipped
    ) {
      files.push(fullPath);
    }
  }

  return files.toSorted((a, b) => a.localeCompare(b));
}

/**
 * Rewrite bare type references in each prop's type string to their namespaced
 * form when the owning component belongs to a namespace. For example, the
 * `onInteractOutside` handler on `Dialog.RootProps` is typed `(event:
 * InteractOutsideEvent) => void` in the source; this rewrites it to `(event:
 * Dialog.InteractOutsideEvent) => void` so the docs match what consumers
 * actually import.
 */
function qualifyPropsForComponent(
  componentName: string,
  props: ComponentProp[],
  namespaceTypes: Map<string, Set<string>>
) {
  const namespace = resolveOwningNamespace(componentName, namespaceTypes);
  if (!namespace) {
    return;
  }

  const typeNames = namespaceTypes.get(namespace);
  if (!typeNames) {
    return;
  }

  for (const prop of props) {
    prop.typeInfo.type = qualifyBareNames(
      prop.typeInfo.type,
      namespace,
      typeNames
    );

    if (prop.typeInfo.kind === 'reference' && prop.typeInfo.expanded) {
      prop.typeInfo.expanded = qualifyBareNames(
        prop.typeInfo.expanded,
        namespace,
        typeNames
      );
    }
  }
}

function resolveOwningNamespace(
  componentName: string,
  namespaceTypes: Map<string, Set<string>>
): string | null {
  const dotIndex = componentName.indexOf('.');
  if (dotIndex !== -1) {
    const root = componentName.slice(0, dotIndex);
    if (namespaceTypes.has(root)) {
      return root;
    }
  }
  if (namespaceTypes.has(componentName)) {
    return componentName;
  }
  if (componentName.startsWith('Composed')) {
    const stripped = componentName.slice('Composed'.length);
    if (namespaceTypes.has(stripped)) {
      return stripped;
    }
  }
  return null;
}

function qualifyBareNames(
  text: string,
  namespace: string,
  names: Set<string>
): string {
  for (const name of names) {
    // Match a bare identifier that is NOT:
    //   - already qualified (preceded by `.`) or part of another identifier
    //     (preceded by a word char)
    //   - the alias name in a `type X = ...` wrapper
    const pattern = new RegExp(
      `(?<![\\w.])(?<!\\btype\\s)${escapeRegex(name)}(?!\\w)`,
      'g'
    );
    text = text.replace(pattern, `${namespace}.${name}`);
  }
  return text;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function prettierAllExpandedTypes(props: ComponentProp[]) {
  for (const prop of props) {
    if (prop.typeInfo.kind !== 'reference' || !prop.typeInfo.expanded) {
      continue;
    }

    // The expansion is a noise-only restatement (e.g., `Array<T>` → `T[]`) -
    // collapse so the UI skips the hover.
    if (isTrivialGenericReduction(prop.typeInfo.type)) {
      prop.typeInfo.expanded = prop.typeInfo.type;
      continue;
    }

    // The expansion is already a complete declaration (e.g., `export interface
    // DialogContentProps extends ... {}`). Format it as-is; don't wrap.
    if (isFullDeclaration(prop.typeInfo.expanded)) {
      prop.typeInfo.expanded = await formatString(prop.typeInfo.expanded);
      continue;
    }

    const aliasName = namespacedAliasName(prop.typeInfo.type);
    if (aliasName) {
      const formatted = await formatString(
        `type ${aliasName} = ${prop.typeInfo.expanded};`
      );
      prop.typeInfo.expanded = formatted.replace(/;[\s\r\n]*$/, '');
      continue;
    }

    // Fall back to showing the expansion wrapped as an anonymous alias so
    // multi-line object types render readably.
    const formatted = await formatString(`type t = ${prop.typeInfo.expanded};`);
    prop.typeInfo.expanded = formatted
      .replace(/^type t =\s+/, '')
      .replace(/;[\s\r\n]*$/, '');
  }
}

function isTrivialGenericReduction(typeName: string): boolean {
  // TypeScript reduces these to equivalent syntax that adds no information.
  return /^(?:Array|ReadonlyArray)<.+>$/s.test(typeName);
}

function isFullDeclaration(text: string): boolean {
  return /^\s*(?:export\s+)?(?:declare\s+)?(?:interface|type)\s+[A-Za-z_$]/.test(
    text
  );
}

function namespacedAliasName(typeName: string): string | null {
  // Only wrap when the source type is namespaced (e.g., `Tooltip.Placement`).
  const lastDot = typeName.lastIndexOf('.');
  if (lastDot === -1) {
    return null;
  }

  const base = typeName.slice(lastDot + 1);

  // Strip generic args: `Namespace.Foo<T>` → `Foo`.
  const genericStart = base.indexOf('<');
  const stripped = genericStart === -1 ? base : base.slice(0, genericStart);

  if (!/^[A-Za-z_$][\w$]*$/.test(stripped)) {
    return null;
  }

  return stripped;
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
