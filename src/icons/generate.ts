import * as fs from 'node:fs/promises';
import { resolve } from 'node:path';

import * as ts from 'typescript';

import { writeFormattedFile } from '../utils/writeFormattedFile';

const generatedDirectory = resolve(import.meta.dirname, 'generated');

async function collectGeneratedIcons() {
  const files = await fs.readdir(generatedDirectory);

  return new Set(
    files
      .filter(file => file.endsWith('.tsx'))
      .map(file => file.replace('.tsx', ''))
  );
}

type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

interface IconEntry {
  name: string;
  weights: IconWeight[];
}

function findIcons(node: ts.Node): IconEntry[] {
  if (ts.isVariableStatement(node)) {
    const declaration = node.declarationList.declarations[0];
    if (
      ts.isVariableDeclaration(declaration) &&
      declaration.name.getText() === 'AVAILABLE_ICONS' &&
      declaration.initializer &&
      ts.isArrayLiteralExpression(declaration.initializer)
    ) {
      const entries: IconEntry[] = [];

      for (const element of declaration.initializer.elements) {
        if (ts.isObjectLiteralExpression(element)) {
          let iconName: string | null = null;
          let weights: IconWeight[] = ['regular'];

          for (const prop of element.properties) {
            if (ts.isPropertyAssignment(prop)) {
              const propName = prop.name.getText();

              if (
                propName === 'icon' &&
                ts.isPropertyAccessExpression(prop.initializer)
              ) {
                iconName = prop.initializer.name.getText();
              } else if (
                propName === 'weights' &&
                ts.isArrayLiteralExpression(prop.initializer)
              ) {
                weights = prop.initializer.elements
                  .filter(ts.isStringLiteral)
                  .map(el => el.text as IconWeight);
              }
            }
          }

          if (iconName) {
            entries.push({ name: iconName, weights });
          }
        }
      }

      return entries;
    }
  }

  let result: IconEntry[] = [];

  ts.forEachChild(node, child => {
    const childResult = findIcons(child);
    if (childResult.length > 0) {
      result = childResult;
    }
  });

  return result;
}

const currentYear = new Date().getFullYear();

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function createIconFile(baseIconName: string, weights: IconWeight[]) {
  const iconNameWithoutIconSuffix = baseIconName.replace(/Icon$/, '');

  const functionDefinitions = weights
    .map(weight => {
      const exportedIconName =
        weight === 'regular'
          ? baseIconName
          : `${iconNameWithoutIconSuffix}${capitalizeFirstLetter(weight)}Icon`;
      const weightProp = weight === 'regular' ? '' : ` weight="${weight}"`;

      return `export function ${exportedIconName}(props: IconProps) {
  return (
    <Icon {...props}>
      <Phosphor${baseIconName}${weightProp} />
    </Icon>
  );
}`;
    })
    .join('\n\n');

  const content = `/**
 * Teleport
 * Copyright (C) ${currentYear}  Gravitational, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* MIT License

Copyright (c) 2020 Phosphor Icons

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

import { Icon, type IconProps } from '@chakra-ui/react';
import { ${baseIconName} as Phosphor${baseIconName} } from '@phosphor-icons/react/dist/ssr/${iconNameWithoutIconSuffix}';

/*

THIS FILE IS GENERATED. DO NOT EDIT.

*/

${functionDefinitions}
`;

  await writeFormattedFile(
    resolve(generatedDirectory, `${baseIconName}.tsx`),
    content
  );
}

async function makeGeneratedDirectory() {
  try {
    await fs.mkdir(generatedDirectory);
  } catch {
    // Directory already exists
  }
}

async function makeIndexFile(iconEntries: IconEntry[]) {
  const allExports: string[] = [];

  for (const entry of iconEntries) {
    const iconNameWithoutSuffix = entry.name.replace(/Icon$/, '');
    const exportNames = entry.weights.map(weight =>
      weight === 'regular'
        ? entry.name
        : `${iconNameWithoutSuffix}${capitalizeFirstLetter(weight)}Icon`
    );
    allExports.push(
      `export { ${exportNames.join(', ')} } from './generated/${entry.name}';`
    );
  }

  const lines = allExports.toSorted((a, b) => a.localeCompare(b)).join('\n');

  const content = `/**
 * Teleport
 * Copyright (C) ${currentYear}  Gravitational, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*

THIS FILE IS GENERATED. DO NOT EDIT.

*/

export { Icon, type IconProps } from '@chakra-ui/react';

${lines}
`;

  await writeFormattedFile(resolve(import.meta.dirname, 'index.ts'), content);
}

async function makeIconsFile(iconEntries: IconEntry[]) {
  const lines = iconEntries
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .map(entry => {
      if (entry.weights.length === 1 && entry.weights[0] === 'regular') {
        return `  { icon: icons.${entry.name} },`;
      }

      const weightsStr = entry.weights.map(w => `'${w}'`).join(', ');

      return `  { icon: icons.${entry.name}, weights: [${weightsStr}] },`;
    })
    .join('\n');

  const content = `import * as icons from '@phosphor-icons/react';
import type { IconWeight } from '@phosphor-icons/react';

export interface IconConfig {
  icon: (typeof icons)[keyof typeof icons];
  weights?: IconWeight[];
}

export const AVAILABLE_ICONS: IconConfig[] = [
  // Automatically sorted when running pnpm generate-icons
${lines}
];
`;

  await writeFormattedFile(resolve(import.meta.dirname, 'icons.ts'), content);
}

async function makeStorybookFile(iconEntries: IconEntry[]) {
  // Chakra icons do not work nicely with `import * as icons from ...`, so instead we
  // generate the file

  const allIconItems: string[] = [];

  for (const entry of iconEntries) {
    for (const weight of entry.weights) {
      const iconNameWithoutSuffix = entry.name.replace(/Icon$/, '');
      const exportedName =
        weight === 'regular'
          ? entry.name
          : `${iconNameWithoutSuffix}${capitalizeFirstLetter(weight)}Icon`;
      allIconItems.push(`<IconItem name="${exportedName}">
    <icons.${exportedName} />
  </IconItem>`);
    }
  }

  const lines = allIconItems
    .toSorted((a, b) => a.localeCompare(b))
    .join('\n  ');

  const content = `import { IconGallery, IconItem, Meta } from '@storybook/addon-docs/blocks';

import * as icons from '../../../icons';
import { DocsHeader } from '../../components/DocsHeader';

<Meta title="Guides/Icons/Icons" />

<DocsHeader title="Icons" />

<IconGallery>
  ${lines}
</IconGallery>
`;

  await writeFormattedFile(
    resolve(import.meta.dirname, '../storybook/stories/icons/icons.mdx'),
    content
  );
}

async function run() {
  await makeGeneratedDirectory();

  const source = await fs.readFile(
    resolve(import.meta.dirname, 'icons.ts'),
    'utf-8'
  );

  const sourceFile = ts.createSourceFile(
    'icons.ts',
    source,
    ts.ScriptTarget.Latest,
    true
  );

  const existingIcons = await collectGeneratedIcons();
  const iconEntries = findIcons(sourceFile);

  // Collect base icon names that should exist
  const expectedIcons = new Set(iconEntries.map(entry => entry.name));

  // Remove icon files that are no longer needed
  for (const existingIcon of existingIcons) {
    if (!expectedIcons.has(existingIcon)) {
      await fs.rm(resolve(generatedDirectory, `${existingIcon}.tsx`));
    }
  }

  // Create or update icon files (one file per base icon)
  for (const entry of iconEntries) {
    await createIconFile(entry.name, entry.weights);
  }

  await makeIconsFile(iconEntries);

  await makeIndexFile(iconEntries);

  await makeStorybookFile(iconEntries);
}

void run();
