import { Box, Code, Heading, Text } from '@chakra-ui/react';
import { MDXProvider } from '@mdx-js/react';
import { DocsContext, SourceContainer } from '@storybook/addon-docs/blocks';
import { useEffect, useMemo, type PropsWithChildren } from 'react';
import type { DocsContextProps } from 'storybook/internal/types';
import { styled, ThemeProvider } from 'storybook/theming';

import { storybookTheme } from '../storybookTheme';
import { StorybookThemeProvider } from '../StorybookThemeProvider';
import { getThemes } from '../themes';
import { CodeBlock } from './CodeBlock';

interface ContextOverride extends DocsContextProps {
  store: {
    userGlobals: {
      globals: {
        theme: string;
      };
    };
  };
}

interface DocsContainerWrapperProps {
  context: ContextOverride;
}

const StorybookOverrides = styled.div`
  .docblock-source {
    background: none;
    color: var(--teleport-colors-text-main);
    margin: 0;
  }
`;

export function DocsContainerWrapper({
  children,
  context,
}: PropsWithChildren<DocsContainerWrapperProps>) {
  const themes = useMemo(() => getThemes(), []);

  const selectedThemeName =
    context.store.userGlobals.globals.theme || 'Dark Theme';

  const theme = useMemo(
    () => themes[selectedThemeName],
    [selectedThemeName, themes]
  );

  useEffect(() => {
    let timeout: number | null = null;

    try {
      const url = new URL(window.parent.location.toString());

      if (url.hash) {
        const element = document.getElementById(
          decodeURIComponent(url.hash.substring(1))
        );

        if (element) {
          timeout = window.setTimeout(() => {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest',
            });
          }, 200);
        }
      }
    } catch {
      // pass
    }

    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }
    };
  }, []);

  return (
    <StorybookThemeProvider theme={theme}>
      <StorybookOverrides>
        <MDXProvider
          components={{
            h1: props => (
              <Heading {...props} as="h1" mt={3} mb={4} size="3xl" />
            ),
            h2: props => (
              <Heading {...props} as="h2" mt={6} mb={3} size="2xl" />
            ),
            h3: props => <Heading {...props} as="h3" mt={6} mb={3} size="xl" />,
            h4: props => <Heading {...props} as="h4" size="md" />,
            h5: props => <Heading {...props} as="h5" size="sm" />,
            h6: props => <Heading {...props} as="h6" size="xs" />,
            p: props => <Text {...props} mb={2} />,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
            pre: props => <CodeBlock text={props.children.props.children} />,
            code: Code,
          }}
        >
          <DocsContext.Provider value={context}>
            <SourceContainer channel={context.channel}>
              <ThemeProvider theme={storybookTheme}>
                <Box py={4} px={10}>
                  {children}
                </Box>
              </ThemeProvider>
            </SourceContainer>
          </DocsContext.Provider>
        </MDXProvider>
      </StorybookOverrides>
    </StorybookThemeProvider>
  );
}
