import '@storybook/addon-themes';

import type { Preview } from '@storybook/react-vite';
import type { DecoratorFunction } from 'storybook/internal/csf';

import { StorybookThemeProvider } from './StorybookThemeProvider';

import '../src/assets/ubuntu/style.css';

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

const preview: Preview = {
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
      // @ts-expect-error this function must be inlined so Storybook can parse it, but if
      // you add the Story types it breaks because of the `:`.
      storySort: (a, b) => {
        const categoriesOrder = ['Guides', 'Components'];

        // Always put the Docs story first
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (a.name === 'Docs' && b.name !== 'Docs') {
          return -1;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (a.name !== 'Docs' && b.name === 'Docs') {
          return 1;
        }

        // Sort by category first
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-argument
        const categoryA = categoriesOrder.indexOf(a.title.split('/')[0]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-argument
        const categoryB = categoriesOrder.indexOf(b.title.split('/')[0]);

        if (categoryA !== categoryB) {
          if (categoryA === -1) {
            return 1;
          }

          if (categoryB === -1) {
            return -1;
          }

          return categoryA - categoryB;
        }

        // If both stories are in the same category, sort alphabetically
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
        return a.name.localeCompare(b.name);
      },
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
