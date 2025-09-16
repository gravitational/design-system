import { Code, Table } from '@chakra-ui/react';

import { system } from '../../../../themes/teleport';

const conditionEntries = Object.entries(system._config.conditions ?? {});

export function ConditionalStylesReference() {
  return (
    <Table.Root size="sm" variant="outline" my={5}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Condition name</Table.ColumnHeader>
          <Table.ColumnHeader>Selector</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {conditionEntries.map(([conditionName, selector]) => (
          <Table.Row key={conditionName}>
            <Table.Cell>
              <Code>_{conditionName}</Code>
            </Table.Cell>
            <Table.Cell>
              <Code>{selector}</Code>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
