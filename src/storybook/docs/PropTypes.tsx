import { Box, Code, Table, Text } from '@chakra-ui/react';
import { useOf, type Of } from '@storybook/addon-docs/blocks';
import Markdown from 'markdown-to-jsx';
import { useMemo } from 'react';
import type {
  ResolvedModuleExportFromType,
  ResolvedModuleExportType,
} from 'storybook/internal/types';

interface PropTypesProps {
  of?: Of;
}

function getArgTypesFromResolved(
  resolved: ResolvedModuleExportFromType<ResolvedModuleExportType>
) {
  if (resolved.type === 'component') {
    throw new Error('Not implemented');
  }

  if (resolved.type === 'meta') {
    return resolved.preparedMeta.argTypes;
  }

  return resolved.story.argTypes;
}

const ignoredProps = [
  'css',
  'htmlSize',
  'htmlWidth',
  'htmlHeight',
  'htmlContent',
  'htmlTranslate',
  'unstyled',
  'theme',
];

const docs: Record<string, string> = {
  as: 'The underlying element to render as.',
  asChild: 'Use the provided child element as the underlying element.',
  disabled: 'If `true`, the component will be disabled.',
};

export function PropTypes({ of }: PropTypesProps) {
  const resolved = useOf(of ?? 'meta');

  const items = useMemo(() => {
    const argTypes = getArgTypesFromResolved(resolved);

    const keys = Object.keys(argTypes)
      .filter(key => !ignoredProps.includes(key))
      .toSorted((a, b) => a.localeCompare(b));

    return keys.map(key => (
      <Table.Row key={key}>
        <Table.Cell>
          <Code variant="outline">{argTypes[key].name}</Code>

          {argTypes[key].type?.required && (
            <Box>
              <Text color="text.slightlyMuted" fontSize="sm">
                * Required
              </Text>
            </Box>
          )}
        </Table.Cell>
        <Table.Cell>
          {argTypes[key].table?.defaultValue?.summary ? (
            <Code variant="outline">
              {argTypes[key].table.defaultValue.summary
                .replace(/^"\\"(.+?)\\""$/, "'$1'")
                .replace(/^"'(.+?)'"$/, "'$1'")
                .replaceAll('"', "'")}
            </Code>
          ) : (
            <Text fontSize="sm" color="text.muted">
              &mdash;
            </Text>
          )}
        </Table.Cell>
        <Table.Cell>
          <ArgType {...(argTypes[key].type as ArgTypeProps)} />

          {argTypes[key].description && (
            <Box fontSize="sm" mt={1}>
              <Markdown>{argTypes[key].description}</Markdown>
            </Box>
          )}

          {docs[key] && (
            <Text fontSize="sm" mt={1}>
              <Markdown>{docs[key]}</Markdown>
            </Text>
          )}
        </Table.Cell>
      </Table.Row>
    ));
  }, [resolved]);

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

interface EnumArgTypeProps {
  name: 'enum';
  value: string[];
}

interface OtherArgTypeProps {
  name: 'other';
  value: string;
}

interface NameIsTypeArgTypeProps {
  name: 'number' | 'string' | 'boolean';
}

type ArgTypeProps =
  | EnumArgTypeProps
  | OtherArgTypeProps
  | NameIsTypeArgTypeProps;

function ArgType(props: ArgTypeProps) {
  const name = props.name;

  switch (name) {
    case 'enum':
      return (
        <Code variant="outline">
          {props.value.map(v => `'${v}'`).join(' | ')}
        </Code>
      );

    case 'number':
    case 'string':
    case 'boolean':
      return <Code variant="outline">{name}</Code>;

    case 'other':
      if (reactTypes.has(props.value)) {
        return <Code variant="outline">React.{props.value}</Code>;
      }

      return <Code variant="outline">{props.value}</Code>;

    default:
      return (
        <Text fontSize="sm" color="text.muted">
          Not handled type: {name}
        </Text>
      );
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
