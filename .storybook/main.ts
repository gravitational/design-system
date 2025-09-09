import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  refs: {
    '@chakra-ui/react': { disable: true },
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      skipChildrenPropWithoutDoc: false,
      shouldSortUnions: true,
      propFilter: prop => {
        if (!prop.parent) return false;

        if (prop.type.name.startsWith('ConditionalValue<')) {
          const startIdx = 'ConditionalValue<'.length;
          let depth = 1;
          let endIdx = startIdx;

          while (depth > 0 && endIdx < prop.type.name.length) {
            if (prop.type.name[endIdx] === '<') depth++;
            else if (prop.type.name[endIdx] === '>') depth--;
            endIdx++;
          }

          prop.type.name = prop.type.name.slice(startIdx, endIdx - 1);
        }

        const isFromNodeModules = prop.parent.fileName.includes('node_modules');

        if (!isFromNodeModules) return true;

        const chakraTypes = [
          'styled-system/generated/recipes.gen.d.ts',
          'styled-system/factory.types.d.ts',
          'types/components/',
        ];

        return chakraTypes.some(type => prop.parent?.fileName.includes(type));
      },
    },
  },
};
export default config;
