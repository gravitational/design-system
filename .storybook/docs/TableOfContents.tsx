import { Box, chakra, Text } from '@chakra-ui/react';
import { useEffect, useId, useState } from 'react';
import type Channel from 'storybook/internal/channels';
import { NAVIGATE_URL } from 'storybook/internal/core-events';
import tocbot from 'tocbot';

import { ArrowCircleUpIcon } from '../../src';
import { EditInGitHubLink } from './EditInGitHubLink';

const Aside = chakra('aside', {
  base: {
    width: '16rem',
    position: 'sticky',
    top: 0,
    height: '100vh',
    flexShrink: 0,

    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
});

const Nav = chakra('nav', {
  base: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    overflowY: 'auto',
    fontSmooth: 'antialiased',
    pt: 6,
    pr: 4,
    pb: 4,
  },
});

interface TableOfContentsProps {
  channel: Channel;
}

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function toggleVisibility() {
      const scrolled = window.scrollY > 300;

      setIsVisible(scrolled);
    }

    toggleVisibility();

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Text
      display="inline-flex"
      alignItems="center"
      gap={2}
      asChild
      fontSize="sm"
      color="text.slightlyMuted"
      cursor="pointer"
      opacity={isVisible ? 1 : 0}
      visibility={isVisible ? 'visible' : 'hidden'}
      transition="opacity 0.3s, visibility 0.3s"
      _hover={{ textDecoration: 'underline' }}
      onClick={scrollToTop}
    >
      <button type="button">
        <ArrowCircleUpIcon size="sm" />
        Scroll to top
      </button>
    </Text>
  );
}

export function TableOfContents({ channel }: TableOfContentsProps) {
  useEffect(() => {
    const configuration: tocbot.IStaticOptions = {
      tocSelector: '.toc-wrapper',
      contentSelector: '[data-docs-content]',
      headingSelector: 'h2, h3',
      ignoreSelector: '.docs-story *, .skip-toc',
      headingsOffset: 20,
      scrollSmoothOffset: -10,
      orderedList: false,
      scrollHandlerType: 'throttle',
      scrollHandlerTimeout: 10,
      throttleTimeout: 10,
      onClick: (e: MouseEvent) => {
        e.preventDefault();
        if (e.currentTarget instanceof HTMLAnchorElement) {
          const [, headerId] = e.currentTarget.href.split('#');

          if (headerId) {
            channel.emit(NAVIGATE_URL, `#${headerId}`);
          }
        }
      },
    };

    const timeout = window.setTimeout(() => {
      tocbot.init(configuration);
    }, 100);

    return () => {
      window.clearTimeout(timeout);
      tocbot.destroy();
    };
  }, [channel]);

  const headingId = useId();

  // if (
  //   !entry ||
  //   CATEGORIES_TO_HIDE.some(category => entry.title.startsWith(category))
  // ) {
  //   return <Box />;
  // }

  return (
    <Aside>
      <Nav
        aria-labelledby={headingId}
        css={{
          '& .toc-wrapper': {
            mt: 2,
          },
          '& > .toc-wrapper > .toc-list': {
            ml: 0,
          },
          '& .toc-list': {
            ml: 4,
          },
          '& .toc-list-item': {
            position: 'relative',
            listStyleType: 'none',
            py: 1,
          },
          '& .toc-list-item.is-active-li::before': {
            opacity: 1,
          },
          '& .toc-list-item > a': {
            color: 'text.slightlyMuted',
            textDecoration: 'none',
            display: 'block',
            // Add slight letter-spacing to compensate for bold weight difference
            letterSpacing: '0.01em',
          },
          '& .toc-list-item.is-active-li > a': {
            fontWeight: 600,
            color: 'text.main',
            textDecoration: 'none',
            // Remove letter-spacing when bold to maintain similar width
            letterSpacing: 'normal',
          },
        }}
      >
        <Text fontWeight="bold" color="text.slightlyMuted">
          On this page
        </Text>

        <div className="toc-wrapper" />

        <Box
          mt={4}
          mb={3}
          borderTop="1px solid {colors.interactive.tonal.neutral.1}"
        />

        <EditInGitHubLink />

        <ScrollToTop />
      </Nav>
    </Aside>
  );
}
