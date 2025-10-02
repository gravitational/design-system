// @ts-check
import '@storybook/addon-themes';

import type { Preview } from '@storybook/react-vite';
import type { DecoratorFunction } from 'storybook/internal/csf';

import { StorybookThemeProvider } from './StorybookThemeProvider';

import '../src/assets/ubuntu/style.css';

import type { IndexEntry } from 'storybook/internal/types';

import { DocsContainerWrapper } from './docs/DocsContainerWrapper';
import { DocsStory } from './docs/Story';
import { getThemes } from './themes';

function themeDecorator(): DecoratorFunction {
  const themes = getThemes();

  const initialTheme = 'Dark Theme';

  return (storyFn, context) => {
    const selectedThemeName = context.globals.theme as string | undefined;
    const theme = selectedThemeName
      ? themes[selectedThemeName]
      : themes[initialTheme];

    return (
      <StorybookThemeProvider theme={theme}>{storyFn()}</StorybookThemeProvider>
    );
  };
}

interface PreviewWithStorySort extends Preview {
  parameters: Preview['parameters'] & {
    options: {
      storySort: (a: IndexEntry, b: IndexEntry) => number;
    };
  };
}

const preview: PreviewWithStorySort = {
  decorators: [themeDecorator()],
  parameters: {
    actions: {
      disable: true,
    },
    layout: 'centered',
    docs: {
      container: DocsContainerWrapper,
      components: {
        story: DocsStory,
      },
      toc: {
        contentsSelector: '.sbdocs-content',
        headingSelector: 'h1, h2, h3',
        ignoreSelector: '#primary',
        title: 'Table of Contents',
        disable: false,
        unsafeTocbotOptions: {
          orderedList: false,
        },
      },
      source: {
        format: false,
        excludeDecorators: true,
        transform: async (source: string) => {
          const prettier = await import('prettier/standalone');
          const prettierPluginBabel = await import('prettier/plugins/babel');
          const prettierPluginEstree = await import('prettier/plugins/estree');

          try {
            return await prettier.format(source, {
              parser: 'babel',
              // @ts-expect-error the prettierPluginEstree types are wrong, but this is the
              // official example from Storybook
              plugins: [prettierPluginBabel, prettierPluginEstree],
            });
          } catch {
            return source;
          }
        },
      },
    },
    options: {
      // This function is parsed by Storybook, and if we include any TypeScript types
      // here it will throw an error. Thus, we need to disable type checking for this
      // block.
      //
      /* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
      storySort: (a, b) => {
        const categoriesOrder = ['Guides', 'Components'];
        const storiesOrder = {
          Guides: [
            'Introduction',
            'Styling',
            'Theming',
            'Icons',
            'Migration Guide',
          ],
          'Guides/Styling': ['Concepts', 'Style Props'],
          'Guides/Styling/Concepts': [
            'Styled Factory',
            'Responsive Design',
            'CSS Variables',
            'Dark Mode',
            'Conditional Styles',
          ],
          'Guides/Theming': ['Concepts'],
          'Guides/Theming/Concepts': [
            'Tokens',
            'Semantic Tokens',
            'Defining Themes',
            'Recipes',
            'Slot Recipes',
            'Adding Chakra Components',
          ],
          Components: ['Buttons'],
          'Components/Buttons': ['Button', 'Close Button'],
        };
        const pathA = a.title.split('/');
        const pathB = b.title.split('/');

        const categoryA = pathA[0];
        const categoryB = pathB[0];

        const categoryIndexA = categoriesOrder.indexOf(categoryA);
        const categoryIndexB = categoriesOrder.indexOf(categoryB);

        const aName =
          a.type === 'story' || a.tags?.includes('attached-mdx')
            ? a.name
            : pathA[pathA.length - 1];
        const bName =
          b.type === 'story' || b.tags?.includes('attached-mdx')
            ? b.name
            : pathB[pathB.length - 1];

        if (categoryA !== categoryB) {
          if (categoryIndexA === -1 && categoryIndexB === -1) {
            return categoryA.localeCompare(categoryB);
          }
          if (categoryIndexA === -1) {
            return 1;
          }
          if (categoryIndexB === -1) {
            return -1;
          }
          return categoryIndexA - categoryIndexB;
        }

        if (aName === 'Docs' && bName !== 'Docs') {
          return -1;
        }
        if (aName !== 'Docs' && bName === 'Docs') {
          return 1;
        }

        const fullPathA = pathA.slice(0, -1).join('/');
        const fullPathB = pathB.slice(0, -1).join('/');

        if (fullPathA === fullPathB) {
          const pathKey = fullPathA || categoryA;
          // @ts-expect-error we know storiesOrder[pathKey] is a string[] if it exists
          const customOrder = storiesOrder[pathKey];

          if (customOrder) {
            const indexA = customOrder.indexOf(aName);
            const indexB = customOrder.indexOf(bName);

            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            if (indexA !== -1) {
              return -1;
            }
            if (indexB !== -1) {
              return 1;
            }
          }

          return aName.localeCompare(bName);
        }

        // @ts-expect-error we cannot type the parameters here
        function getDirectChildName(path, category) {
          if (path.length === 2 && path[0] === category) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return path[1];
          }
          if (path.length > 2 && path[0] === category) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return path[1];
          }
          return null;
        }

        const directChildA = getDirectChildName(pathA, categoryA);
        const directChildB = getDirectChildName(pathB, categoryB);

        if (directChildA && directChildB && categoryA === categoryB) {
          // @ts-expect-error we know storiesOrder[categoryA] is a string[] if it exists
          const customOrder = storiesOrder[categoryA];

          if (customOrder) {
            const indexA = customOrder.indexOf(directChildA);
            const indexB = customOrder.indexOf(directChildB);

            if (indexA !== -1 && indexB !== -1) {
              return indexA - indexB;
            }
            if (indexA !== -1) {
              return -1;
            }
            if (indexB !== -1) {
              return 1;
            }
          }
        }

        for (
          let depth = 0;
          depth < Math.min(pathA.length - 1, pathB.length - 1);
          depth++
        ) {
          if (pathA[depth] !== pathB[depth]) {
            const parentPath =
              depth === 0 ? categoryA : pathA.slice(0, depth).join('/');
            // @ts-expect-error we know storiesOrder[parentPath] is a string[] if it exists
            const subcategoryOrder = storiesOrder[parentPath];

            if (subcategoryOrder) {
              const subA = pathA[depth];
              const subB = pathB[depth];
              const indexA = subcategoryOrder.indexOf(subA);
              const indexB = subcategoryOrder.indexOf(subB);

              if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
              }
              if (indexA !== -1) {
                return -1;
              }
              if (indexB !== -1) {
                return 1;
              }
            }

            return pathA[depth].localeCompare(pathB[depth]);
          }
        }

        const depthA = pathA.length;
        const depthB = pathB.length;

        if (depthA !== depthB) {
          return depthA - depthB;
        }

        return aName.localeCompare(bName);
      },
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    },
    controls: {
      disableSaveFromUI: true,
      expanded: true,
      exclude: [
        'htmlSize',
        'htmlWidth',
        'htmlHeight',
        'htmlTranslate',
        'htmlContent',
        'css',
        'as',
        'asChild',
        'unstyled',
        'theme',
      ],
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  initialGlobals: {
    theme: 'Dark Theme',
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'contrast',
        items: ['Light Theme', 'Dark Theme', 'BBLP Theme'],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
