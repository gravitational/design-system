import {
  Blockquote,
  Box,
  Code,
  Heading,
  HStack,
  Link,
  List,
  Text,
  VStack,
  type HeadingProps,
  type HTMLChakraProps,
} from '@chakra-ui/react';
import { MDXProvider } from '@mdx-js/react';
import { DocsContext, SourceContainer } from '@storybook/addon-docs/blocks';
import {
  Children,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
} from 'react';
import { NAVIGATE_URL } from 'storybook/internal/core-events';
import type { DocsContextProps } from 'storybook/internal/types';
import { styled, ThemeProvider } from 'storybook/theming';
import { useCopyToClipboard } from 'usehooks-ts';

import {
  ArrowUpRightIcon,
  ClipboardIcon,
  IconButton,
  Table,
  Tooltip,
} from '../../src';
import { storybookTheme } from '../storybookTheme';
import { StorybookThemeProvider } from '../StorybookThemeProvider';
import { getThemes } from '../themes';
import { CodeBlock } from './CodeBlock';
import { DocsNavigation } from './DocsNavigation';
import { TableOfContents } from './TableOfContents';

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

  .markdown-alert {
    padding: var(--teleport-spacing-2) var(--teleport-spacing-3);
    margin: var(--teleport-spacing-4) 0;
    border: 1px solid;
    border-radius: var(--teleport-radii-md);

    & > :first-of-type {
      margin-top: 0;
    }

    & > :last-child {
      margin-bottom: 0;
    }
  }

  .markdown-alert-note {
    background: var(--teleport-colors-interactive-tonal-informational-2);
    border-color: var(--teleport-colors-interactive-solid-accent-default);

    .octicon {
      fill: var(--teleport-colors-interactive-solid-accent-default);
    }

    a {
      color: var(--teleport-colors-alpha-800);
      text-decoration: underline;

      &:hover {
        color: var(--teleport-colors-text-main);
      }
    }
  }

  .markdown-alert-tip {
    background: var(--teleport-colors-interactive-tonal-success-2);
    border-color: var(--teleport-colors-interactive-solid-success-default);

    .octicon {
      fill: var(--teleport-colors-interactive-solid-success-default);
    }
  }

  .markdown-alert-warning {
    background: var(--teleport-colors-interactive-tonal-alert-2);
    border-color: var(--teleport-colors-interactive-solid-alert-default);

    .octicon {
      fill: var(--teleport-colors-interactive-solid-alert-default);
    }
  }

  .markdown-alert-caution {
    background: var(--teleport-colors-interactive-tonal-danger-2);
    border-color: var(--teleport-colors-interactive-solid-danger-default);

    .octicon {
      fill: var(--teleport-colors-interactive-solid-danger-default);
    }
  }

  .markdown-alert-title {
    display: flex;
    margin-bottom: var(--teleport-spacing-2);
    align-items: center;
    font-weight: var(--teleport-font-weights-bold);
  }

  .octicon {
    margin-right: var(--teleport-spacing-2);
    display: inline-block;
    overflow: visible !important;
    vertical-align: text-bottom;
  }
`;

export function DocsLink(props: HTMLChakraProps<'a'>) {
  const context = useContext(DocsContext);
  const url = props.href ?? '';
  const isExternal = url.startsWith('http://') || url.startsWith('https://');

  function handleClick(event: MouseEvent) {
    const LEFT_BUTTON = 0;
    const isLeftClick =
      event.button === LEFT_BUTTON &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey;

    if (isLeftClick) {
      event.preventDefault();
      context.channel.emit(NAVIGATE_URL, url);
    }
  }

  if (isExternal) {
    const { children, ...rest } = props;

    return (
      <Link {...rest} target="_blank">
        {children}

        <ArrowUpRightIcon />
      </Link>
    );
  }

  return <Link {...props} onClick={handleClick} />;
}

function HeadingWrapper({ id, mt, mb, my, children, ...props }: HeadingProps) {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  const timeoutRef = useRef<number | null>(null);

  const location = new URL(window.location.href);
  const docId = location.searchParams.get('id') ?? '';
  const idValue = id ?? '';
  const url = location.origin + '/?path=/docs/' + docId + '#' + idValue;

  async function handleCopy() {
    await copy(url);

    setCopied(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Box
      display="flex"
      alignItems="center"
      ml="-32px"
      mt={mt}
      my={my}
      mb={mb}
      className="group"
    >
      <Tooltip
        content={copied ? 'Copied' : 'Copy link to clipboard'}
        openDelay={0}
        positioning={{
          placement: 'top',
        }}
        closeDelay={0}
        closeOnClick={false}
      >
        <IconButton
          onClick={() => {
            void handleCopy();
          }}
          size="sm"
          fill="minimal"
          intent="neutral"
          mr="8px"
          opacity={0}
          _groupHover={{ opacity: 1 }}
        >
          <ClipboardIcon />
        </IconButton>
      </Tooltip>

      <Heading {...props} id={id} cursor="pointer">
        <a href={url}>{children}</a>
      </Heading>
    </Box>
  );
}

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

    function scrollToHash(ms: number) {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }

      try {
        const url = new URL(window.parent.location.toString());

        if (url.hash) {
          const element = document.getElementById(
            decodeURIComponent(url.hash.substring(1))
          );

          if (element) {
            timeout = window.setTimeout(() => {
              const elementPosition =
                element.getBoundingClientRect().top + window.pageYOffset;
              const offsetPosition = elementPosition - 20;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
              });
            }, ms);
          }
        }
      } catch {
        // pass
      }
    }

    scrollToHash(200);

    function handleChange() {
      scrollToHash(0);
    }

    window.parent.addEventListener('popstate', handleChange);
    window.parent.addEventListener('hashchange', handleChange);

    return () => {
      if (timeout) {
        window.clearTimeout(timeout);
        timeout = null;
      }

      window.parent.removeEventListener('popstate', handleChange);
      window.parent.removeEventListener('hashchange', handleChange);
    };
  }, []);

  return (
    <StorybookThemeProvider theme={theme}>
      <StorybookOverrides>
        <MDXProvider
          components={{
            h1: props => (
              <HeadingWrapper {...props} as="h1" mt={3} mb={4} size="3xl" />
            ),
            h2: props => (
              <HeadingWrapper {...props} as="h2" mt={6} mb={4} size="2xl" />
            ),
            h3: props => (
              <HeadingWrapper {...props} as="h3" mt={3} mb={3} size="xl" />
            ),
            h4: props => (
              <HeadingWrapper
                {...props}
                as="h4"
                mt={4}
                mb={2}
                size="lg"
                fontSize="16px"
              />
            ),
            h5: props => (
              <HeadingWrapper {...props} as="h5" mt={4} mb={0} size="md" />
            ),
            h6: props => <HeadingWrapper {...props} as="h6" size="sm" />,
            p: props => <Text {...props} mb={2} />,
            em: props => <Text as="em" fontStyle="italic" {...props} />,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            pre: props => <CodeBlock {...props.children.props} />,
            ul: props => <List.Root mt={4} mb={6} pl={4} {...props} />,
            li: props => <List.Item pl={1} {...props} />,
            a: props => <DocsLink {...props} />,
            table: props => (
              <Table.Root size="sm" variant="outline" mb={6} {...props} />
            ),
            thead: props => <Table.Header {...props} />,
            td: props => <Table.Cell {...props} />,
            tr: props => <Table.Row {...props} />,
            th: props => <Table.ColumnHeader {...props} />,
            blockquote: ({ children, ...rest }) => {
              const child = Children.toArray(children as ReactNode[]).find(
                child => typeof child !== 'string'
              );

              // @ts-expect-error TS2322 - need to figure out type here
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
              const content = child.props.children;

              return (
                <Blockquote.Root {...rest} my={5}>
                  <Blockquote.Content>{content}</Blockquote.Content>
                </Blockquote.Root>
              );
            },
            code: Code,
          }}
        >
          <DocsContext.Provider value={context}>
            <SourceContainer channel={context.channel}>
              <ThemeProvider theme={storybookTheme}>
                <VStack flex="1">
                  <Box maxW="7xl" w="100%" data-docs-content mr={-4}>
                    <HStack gap={6} align="flex-start">
                      <Box flex={1} py={4}>
                        {children}

                        <DocsNavigation />
                      </Box>

                      <TableOfContents channel={context.channel} />
                    </HStack>
                  </Box>
                </VStack>
              </ThemeProvider>
            </SourceContainer>
          </DocsContext.Provider>
        </MDXProvider>
      </StorybookOverrides>
    </StorybookThemeProvider>
  );
}
