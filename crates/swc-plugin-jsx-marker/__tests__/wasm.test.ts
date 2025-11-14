import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

import { transform, type Options } from '@swc/core';
import { describe, expect, test } from 'vitest';

const pluginName = 'swc_plugin_jsx_marker.wasm';

console.log(
  path.join(path.dirname(url.fileURLToPath(import.meta.url)), '..', pluginName)
);

const options: Options = {
  jsc: {
    parser: {
      syntax: 'typescript',
      tsx: true,
    },
    experimental: {
      plugins: [
        [
          path.join(
            path.dirname(url.fileURLToPath(import.meta.url)),
            '..',
            pluginName
          ),
          {
            libraryName: '@chakra-ui/react',
            attributeName: 'data-uic',
          },
        ],
      ],
    },
  },
};

describe('Design System Plugin', () => {
  test('Should add data-uic to basic components', async () => {
    const code = await fs.readFile(
      path.resolve(
        url.fileURLToPath(import.meta.url),
        '..',
        'fixtures',
        'basic.tsx'
      ),
      'utf-8'
    );
    const output = await transform(code, options);
    expect(output.code).toMatchSnapshot();
  });

  test('Should track styled component chains', async () => {
    const code = await fs.readFile(
      path.resolve(
        url.fileURLToPath(import.meta.url),
        '..',
        'fixtures',
        'styled-chain.tsx'
      ),
      'utf-8'
    );
    const output = await transform(code, options);
    expect(output.code).toMatchSnapshot();
  });

  test('Should support custom prefix', async () => {
    const code = await fs.readFile(
      path.resolve(
        url.fileURLToPath(import.meta.url),
        '..',
        'fixtures',
        'basic.tsx'
      ),
      'utf-8'
    );
    const customOptions: Options = {
      ...options,
      jsc: {
        ...options.jsc,
        experimental: {
          plugins: [
            [
              path.join(
                path.dirname(url.fileURLToPath(import.meta.url)),
                '..',
                pluginName
              ),
              {
                libraryName: '@chakra-ui/react',
              },
            ],
          ],
        },
      },
    };
    const output = await transform(code, customOptions);
    expect(output.code).toMatchSnapshot();
  });

  test('Should default to Chakra UI when libraryName is not provided', async () => {
    const code = await fs.readFile(
      path.resolve(
        url.fileURLToPath(import.meta.url),
        '..',
        'fixtures',
        'basic.tsx'
      ),
      'utf-8'
    );
    const defaultOptions: Options = {
      ...options,
      jsc: {
        ...options.jsc,
        experimental: {
          plugins: [
            [
              path.join(
                path.dirname(url.fileURLToPath(import.meta.url)),
                '..',
                pluginName
              ),
              {},
            ],
          ],
        },
      },
    };
    const output = await transform(code, defaultOptions);
    expect(output.code).toContain('data-uic');
  });

  test('Should use custom attribute name when provided', async () => {
    const code = await fs.readFile(
      path.resolve(
        url.fileURLToPath(import.meta.url),
        '..',
        'fixtures',
        'basic.tsx'
      ),
      'utf-8'
    );
    const customAttrOptions: Options = {
      ...options,
      jsc: {
        ...options.jsc,
        experimental: {
          plugins: [
            [
              path.join(
                path.dirname(url.fileURLToPath(import.meta.url)),
                '..',
                pluginName
              ),
              {
                libraryName: '@chakra-ui/react',
                attributeName: 'data-testid',
              },
            ],
          ],
        },
      },
    };
    const output = await transform(code, customAttrOptions);
    expect(output.code).toContain('data-testid');
    expect(output.code).not.toContain('data-uic');
  });

  test('Should ignore styled-components and only process styled from configured library', async () => {
    const code = await fs.readFile(
      path.resolve(
        url.fileURLToPath(import.meta.url),
        '..',
        'fixtures',
        'styled-components-ignore.tsx'
      ),
      'utf-8'
    );
    const output = await transform(code, options);

    // Should have data-uic for Box (regular import from configured library)
    // Should have data-uic for ChakraStyledBox (styled from @chakra-ui/react)
    expect(output.code).toContain('"data-uic": "MyComponent-Box"');
    expect(output.code).toContain(
      '"data-uic": "MyComponent-ChakraStyledBox-Box"'
    );

    // Should NOT have data-uic for StyledComponentsButton (styled from styled-components)
    const lines = output.code.split('\n');
    const styledComponentsButtonLines = lines.filter(
      line =>
        line.includes('StyledComponentsButton') &&
        !line.includes('import') &&
        !line.includes('var')
    );

    for (const line of styledComponentsButtonLines) {
      expect(line).not.toContain('data-uic');
    }
  });
});
