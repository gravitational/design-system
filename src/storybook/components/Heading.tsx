import {
  Box,
  Heading as ChakraHeading,
  type HeadingProps,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import { IconButton, Tooltip } from '../../components';
import { ClipboardIcon } from '../../icons';

export function Heading({ id, mt, mb, my, children, ...props }: HeadingProps) {
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

      <ChakraHeading {...props} id={id} cursor="pointer">
        <a href={url}>{children}</a>
      </ChakraHeading>
    </Box>
  );
}
