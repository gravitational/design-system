import * as fs from 'node:fs/promises';
import { resolve } from 'node:path';

import * as ts from 'typescript';

const generatedDirectory = resolve(import.meta.dirname, 'generated');

async function collectGeneratedIcons() {
  const files = await fs.readdir(generatedDirectory);

  return new Set(
    files
      .filter(file => file.endsWith('.tsx'))
      .map(file => file.replace('.tsx', ''))
  );
}

function findIcons(node: ts.Node): Set<string> {
  if (ts.isVariableStatement(node)) {
    const declaration = node.declarationList.declarations[0];
    if (
      ts.isVariableDeclaration(declaration) &&
      declaration.name.getText() === 'AVAILABLE_ICONS' &&
      declaration.initializer &&
      ts.isArrayLiteralExpression(declaration.initializer)
    ) {
      return new Set(
        declaration.initializer.elements
          .filter(ts.isPropertyAccessExpression)
          .map(element => element.name.getText())
      );
    }
  }

  let result = new Set<string>();

  ts.forEachChild(node, child => {
    const childResult = findIcons(child);
    if (childResult.size > 0) {
      result = childResult;
    }
  });

  return result;
}

const currentYear = new Date().getFullYear();

async function createIconFile(iconName: string) {
  const iconNameWithoutSuffix = iconName.replace(/Icon$/, '');

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
import { ${iconName} as Phosphor${iconName} } from '@phosphor-icons/react/dist/csr/${iconNameWithoutSuffix}';

/*

THIS FILE IS GENERATED. DO NOT EDIT.

*/

export function ${iconName}(props: IconProps) {
  return (
    <Icon {...props}>
      <Phosphor${iconName} />
    </Icon>
  );
}
`;

  await fs.writeFile(resolve(generatedDirectory, `${iconName}.tsx`), content);
}

async function makeGeneratedDirectory() {
  try {
    await fs.mkdir(generatedDirectory);
  } catch {
    // Directory already exists
  }
}

async function makeIndexFile(icons: Set<string>) {
  const lines = Array.from(icons)
    .toSorted((a, b) => a.localeCompare(b))
    .map(icon => `export { ${icon} } from './generated/${icon}';`)
    .join('\n');

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

  await fs.writeFile(resolve(import.meta.dirname, 'index.ts'), content);
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
  const icons = findIcons(sourceFile);

  for (const existingIcon of existingIcons) {
    if (!icons.has(existingIcon)) {
      await fs.rm(resolve(generatedDirectory, `${existingIcon}.tsx`));
    }
  }

  for (const icon of icons) {
    if (!existingIcons.has(icon)) {
      await createIconFile(icon);
    }
  }

  await makeIndexFile(icons);
}

void run();
