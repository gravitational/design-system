import { mkdir, stat } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

import { writeFormattedFile } from '../utils/writeFormattedFile';

const createPath = process.argv[2];
const force = process.argv.includes('--force');
const withStories = process.argv.includes('--with-stories');

if (!createPath) {
  // eslint-disable-next-line no-console
  console.error('Please provide a component name.');
  process.exit(1);
}

async function fileExists(path: string) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function create(path: string) {
  const split = path.split('/');
  const outputDirectory = split.slice(0, -1).join('/');
  const type = split[0];
  const last = split[split.length - 1];
  const outputPath = resolve(import.meta.dirname, 'stories', outputDirectory);
  const title = split.map(capitalize).join('/');

  if (type === 'components') {
    if (!force) {
      if (await fileExists(resolve(outputPath, `${last}.stories.tsx`))) {
        throw new Error(
          `Story for component "${last}" already exists. Use --force to overwrite.`
        );
      }
      if (await fileExists(resolve(outputPath, `${last}.mdx`))) {
        throw new Error(
          `MDX for component "${last}" already exists. Use --force to overwrite.`
        );
      }
    }

    const componentsPath = resolve(import.meta.dirname, 'components');
    const componentsRelativePath = relative(
      resolve(import.meta.dirname, outputPath),
      componentsPath
    );
    const indexRelativePath = relative(
      resolve(import.meta.dirname, outputPath),
      resolve(import.meta.dirname, '..')
    );

    const meta = withStories
      ? `<Meta of={${last}Stories} />`
      : `<Meta title="${title}" />`;

    const mdxTemplate = `import { Meta } from '@storybook/addon-docs/blocks';

import { Canvas } from '${componentsRelativePath}/Canvas';
import { DocsHeader } from '${componentsRelativePath}/DocsHeader';
import { PropTypes } from '${componentsRelativePath}/PropTypes';

import { ${last} } from '${indexRelativePath}';

import * as ${last}Stories from './${last}.stories';

${meta}

<DocsHeader
  title="${last}"
  description=""
  recipePath=""
  sourcePath=""
/>

<Canvas of={${last}Stories.Preview} />

## Usage

Information about usage here.

\`\`\`tsx
import { ${last} } from '@gravitational/design-system';

function Example() {
  return (
    <${last} />
  );
}
\`\`\`

## Examples

### Example

<Canvas of={${last}Stories.Example} />

## Props

<PropTypes of={${last}} />
`;

    const storiesTemplate = `import { Box, ${last} } from '@chakra-ui/react';
import type { Meta } from '@storybook/react-vite';

const meta = {
  component: ${last},
  ${withStories ? "title: '" + title + "'," : ''}
} satisfies Meta<typeof ${last}>;

export default meta;

export function Preview() {
  return (
    <Box>
      <${last} />
    </Box>
  );
}

${withStories ? '' : `Preview.tags = ['!dev'];`}

export function Example() {
  return (
    <Box>
      <${last} />
    </Box>
  );
}

${withStories ? '' : `Example.tags = ['!dev'];`}

`;

    try {
      await mkdir(outputPath, { recursive: true });
    } catch {
      // ignore
    }

    await writeFormattedFile(resolve(outputPath, `${last}.mdx`), mdxTemplate);

    await writeFormattedFile(
      resolve(outputPath, `${last}.stories.tsx`),
      storiesTemplate
    );
  }
}

create(createPath).catch((err: unknown) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

function capitalize(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}
