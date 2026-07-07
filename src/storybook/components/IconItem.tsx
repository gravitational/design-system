import { Box, chakra } from '@chakra-ui/react';
import { type PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import { Grid, Tooltip } from '../../components';

const IconItemContainer = chakra('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    px: 2,
    py: 3,
    color: 'text.main',
    fontSize: 'xl',
  },
});

const IconName = chakra('div', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    border: '1px solid {colors.interactive.tonal.neutral.2}',
    borderRadius: 'md',
    fontFamily: 'mono',
    fontSize: '11px',
    lineHeight: 1,
    color: 'text.main',
    px: 2,
    py: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    _hover: {
      bg: 'interactive.tonal.neutral.1',
    },
  },
});

interface IconItemProps {
  name: string;
}

export function IconItem({ children, name }: PropsWithChildren<IconItemProps>) {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();
  const timeoutRef = useRef<number>(null);

  async function handleCopy() {
    await copy(name);

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
    <IconItemContainer>
      {children}

      <Tooltip
        content={copied ? 'Copied' : 'Copy to clipboard'}
        openDelay={0}
        closeDelay={0}
        closeOnClick={false}
      >
        <IconName
          onClick={() => {
            void handleCopy();
          }}
        >
          {name}
        </IconName>
      </Tooltip>
    </IconItemContainer>
  );
}

interface IconGalleryProps {
  title: string;
}

export function IconGallery({ children }: PropsWithChildren<IconGalleryProps>) {
  return (
    <Box
      w="full"
      mb={6}
      bg="bg"
      rounded="md"
      borderWidth="0.5px"
      borderColor="interactive.tonal.neutral.1"
    >
      <Grid
        templateColumns="repeat(auto-fill, minmax(210px, 1fr))"
        gap={2}
        p={6}
      >
        {children}
      </Grid>
    </Box>
  );
}
