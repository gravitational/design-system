import {
  Box,
  Code,
  Table,
  Text,
  useDisclosure,
  type CodeProps,
} from '@chakra-ui/react';
import Markdown from 'markdown-to-jsx';
import Prism from 'prismjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCopyToClipboard } from 'usehooks-ts';

import { HStack, IconButton, StarIcon, Tooltip } from '../..';
import { DocsLink } from '../../../.storybook/docs/DocsContainerWrapper';
import { CheckIcon, ClipboardIcon } from '../../icons';
import generated from '../props/generated.json' with { type: 'json' };

const GENERATED_ENTRIES = generated as ComponentEntry[];

export type TypeInfo =
  | { kind: 'primitive'; type: string }
  | { kind: 'literal'; type: string }
  | { kind: 'function'; type: string }
  | { kind: 'array'; type: string }
  | { kind: 'tuple'; type: string }
  | { kind: 'union'; type: string; members: string[] }
  | { kind: 'intersection'; type: string; members: string[] }
  | { kind: 'object'; type: string }
  | { kind: 'reference'; type: string; expanded: string }
  | { kind: 'unknown'; type: string };

export interface ComponentProp {
  name: string;
  required: boolean;
  conditional: boolean;
  readonly: boolean;
  description: string | null;
  defaultValue: string | boolean | number | null | undefined;
  sourceFile: string | null;
  typeInfo: TypeInfo;
}

export interface RefInfo {
  type: string;
  elementType: string;
  expandedType: string | null;
  imperative: boolean;
}

export interface ComponentEntry {
  name: string;
  props: ComponentProp[];
  ref: RefInfo | null;
}

interface PropTypesProps {
  name: string;
}

export function PropTypes({ name }: PropTypesProps) {
  const items = useMemo(() => {
    const component = GENERATED_ENTRIES.find(entry => entry.name === name);

    if (!component) {
      return null;
    }

    const sorted = component.props.toSorted((a, b) =>
      a.name.localeCompare(b.name)
    );

    return sorted.map(prop => (
      <Table.Row key={prop.name}>
        <Table.Cell whiteSpace="nowrap" minW="120px">
          <Code variant="outline">{prop.name}</Code>

          {prop.required && (
            <Box>
              <Text color="text.slightlyMuted" fontSize="sm">
                * Required
              </Text>
            </Box>
          )}
        </Table.Cell>
        <Table.Cell whiteSpace="nowrap" minW="150px">
          {prop.defaultValue ? (
            <DefaultValue value={prop.defaultValue} />
          ) : (
            <Text fontSize="sm" color="text.muted">
              &mdash;
            </Text>
          )}
        </Table.Cell>
        <Table.Cell>
          <ArgType prop={prop} />

          {prop.description && (
            <Box fontSize="sm" mt={1} css={{ '& code': { fontSize: '0.9em' } }}>
              <Markdown>{prop.description}</Markdown>
            </Box>
          )}
        </Table.Cell>
      </Table.Row>
    ));
  }, [name]);

  return (
    <Table.Root size="sm" variant="outline" my={5}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Prop</Table.ColumnHeader>
          <Table.ColumnHeader>Default</Table.ColumnHeader>
          <Table.ColumnHeader>Type</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>{items}</Table.Body>
    </Table.Root>
  );
}

interface DefaultValueProps {
  value: string | boolean | number;
}

function DefaultValue({ value }: DefaultValueProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.innerHTML = Prism.highlight(
      value.toString().replace(/"/g, "'"),
      Prism.languages.tsx,
      'tsx'
    );
  }, [value]);

  return (
    <pre>
      <Code ref={ref} className="language-tsx" variant="outline">
        {value}
      </Code>
    </pre>
  );
}

interface HighlightedCodeProps {
  children: string;
  primitive?: boolean;
}

function HighlightedCode({
  children,
  primitive,
  ...rest
}: HighlightedCodeProps & CodeProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.innerHTML = Prism.highlight(
      children.replace(/"/g, "'"),
      Prism.languages.tsx,
      'tsx'
    );
  }, [children]);

  return (
    <Box as="pre">
      <Code
        ref={ref}
        className="language-tsx"
        variant="outline"
        {...rest}
        css={{
          display: 'inline-block',
          paddingTop: '2px',
          '&, & *': {
            color: primitive ? 'syntax.purple' : 'syntax.orange',
          },
        }}
      >
        {children}
      </Code>
    </Box>
  );
}

interface ArgTypeWithExpandedProps {
  type: string;
  expanded: string;
}

function ArgTypeWithExpanded({ type, expanded }: ArgTypeWithExpandedProps) {
  const { open, onClose, onOpen } = useDisclosure();

  const copiedTimeoutRef = useRef<number>(null);
  const timeoutRef = useRef<number>(null);

  const handleMouseOver = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      onOpen();
    }, 200);
  }, [onOpen]);

  const handleMouseOut = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      onClose();
    }, 100);
  }, [onClose]);

  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();

  async function handleCopy() {
    await copy(expanded);

    setCopied(true);

    if (copiedTimeoutRef.current) {
      window.clearTimeout(copiedTimeoutRef.current);
    }

    copiedTimeoutRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        window.clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box
      pos="relative"
      w="fit-content"
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    >
      <Box
        pos="absolute"
        left="50%"
        bottom="100%"
        transform="translateX(-50%)"
        zIndex={10}
        display={open ? 'block' : 'none'}
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        overflowWrap="break-word"
        maxW="700px"
      >
        <Tooltip
          content={copied ? 'Copied' : 'Copy to clipboard'}
          openDelay={0}
          positioning={{
            placement: 'right',
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

        <HighlightedCode
          bg="levels.elevated"
          p={2}
          boxShadow="md"
          borderWidth="1px"
          borderColor="interactive.tonal.neutral.1"
          pr={6}
        >
          {expanded}
        </HighlightedCode>
      </Box>

      <HighlightedCode
        cursor="pointer"
        textDecoration="underline"
        _hover={{ textDecoration: 'none' }}
      >
        {type}
      </HighlightedCode>
    </Box>
  );
}

interface ArgTypeProps {
  prop: ComponentProp;
}

function ArgType({ prop }: ArgTypeProps) {
  const { open, onClose, onOpen } = useDisclosure();

  const timeoutRef = useRef<number>(null);

  const handleMouseOver = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      onOpen();
    }, 150);
  }, [onOpen]);

  const handleMouseOut = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      onClose();
    }, 100);
  }, [onClose]);

  return (
    <HStack wrap="wrap">
      <ArgTypeValue typeInfo={prop.typeInfo} />

      {prop.conditional && (
        <Code
          variant="outline"
          color="text.muted"
          fontFamily="body"
          display="flex"
          gap={1}
          alignItems="center"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          pos="relative"
          cursor="pointer"
          _hover={{
            bg: 'interactive.tonal.neutral.1',
          }}
        >
          <Box
            pos="absolute"
            bg="levels.elevated"
            left="50%"
            bottom="calc(100% + 4px)"
            color="text.main"
            transform="translateX(-50%)"
            p={2}
            boxShadow="md"
            borderWidth="1px"
            borderColor="interactive.tonal.neutral.1"
            borderRadius="md"
            zIndex={10}
            display={open ? 'block' : 'none'}
            whiteSpace="pre-wrap"
            wordBreak="break-word"
            overflowWrap="break-word"
            w="300px"
          >
            Conditional values enable this prop to respond to screen size,
            letting you set different values for each breakpoint.
            <Box mt={2}>
              <DocsLink href="/?path=/docs/guides-styling-concepts-responsive-design--docs">
                View Responsive Design Docs
              </DocsLink>
            </Box>
          </Box>
          <StarIcon />
          Conditional Value
        </Code>
      )}
    </HStack>
  );
}

interface ArgTypeValueProps {
  typeInfo: TypeInfo;
}

function ArgTypeValue({ typeInfo }: ArgTypeValueProps) {
  switch (typeInfo.kind) {
    case 'literal':
    case 'function':
    case 'array':
    case 'tuple':
    case 'object':
    case 'unknown':
      return <HighlightedCode>{typeInfo.type}</HighlightedCode>;

    case 'reference':
      if (reactTypes.has(typeInfo.type)) {
        return <HighlightedCode>{`React.${typeInfo.type}`}</HighlightedCode>;
      }

      if (typeInfo.expanded && typeInfo.expanded !== typeInfo.type) {
        return (
          <ArgTypeWithExpanded
            type={typeInfo.type}
            expanded={typeInfo.expanded}
          />
        );
      }

      return <Code variant="outline">{typeInfo.type}</Code>;

    case 'intersection':
    case 'union':
      const separator = typeInfo.kind === 'union' ? ' | ' : ' & ';

      return (
        <HighlightedCode>{typeInfo.members.join(separator)}</HighlightedCode>
      );

    case 'primitive':
      return <HighlightedCode primitive>{typeInfo.type}</HighlightedCode>;
  }
}

const reactTypes = new Set([
  'ElementType',
  'ReactNode',
  'ReactElement',
  'ReactChild',
  'ReactFragment',
  'ReactPortal',
  'CSSProperties',
  'Component',
  'PureComponent',
  'FC',
  'FunctionComponent',
  'ComponentType',
  'PropsWithChildren',
  'RefObject',
  'MutableRefObject',
]);
