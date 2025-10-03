import { chakra, IconButton } from '@chakra-ui/react';
import { type HTMLChakraProps } from '@chakra-ui/react/styled-system';
import Prism from 'prismjs';
import { useEffect, useRef, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import { CheckIcon, ClipboardIcon, Tooltip } from '../../src';

import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import './highlight.css';

interface CodeBlockProps extends HTMLChakraProps<'pre'> {
  className?: string;
  children: string;
}

const Pre = chakra('pre');

export function CodeBlock({
  children: text,
  className,
  ...rest
}: CodeBlockProps) {
  const ref = useRef<HTMLPreElement>(null);

  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  const timeoutRef = useRef<number>(null);

  useEffect(() => {
    if (ref.current) {
      const language = className?.replace('language-', '') ?? 'tsx';

      ref.current.innerHTML = Prism.highlight(
        text,
        Prism.languages[language],
        language
      );
    }
  }, [className, text]);

  async function handleCopy() {
    await copy(text);

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
    <Pre
      bg="levels.surface"
      border="1px solid {colors.interactive.tonal.neutral.1}"
      borderRadius="md"
      fontSize="md"
      overflow="hidden"
      pos="relative"
      my={5}
      py={4}
      px={4}
      {...rest}
    >
      <Tooltip
        content={copied ? 'Copied' : 'Copy to clipboard'}
        openDelay={0}
        positioning={{
          placement: 'left',
        }}
        closeDelay={0}
        closeOnClick={false}
      >
        <IconButton
          pos="absolute"
          aria-label="Copy to clipboard"
          onClick={() => {
            void handleCopy();
          }}
          top={1}
          right={1}
          px={1}
          py={1}
          fill="minimal"
          intent="neutral"
          size="sm"
        >
          {copied ? <CheckIcon /> : <ClipboardIcon />}
        </IconButton>
      </Tooltip>

      <code ref={ref} className="language-tsx" />
    </Pre>
  );
}
