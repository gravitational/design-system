import { List } from '@chakra-ui/react';
import { DocsContext } from '@storybook/addon-docs/blocks';
import { useContext } from 'react';

import { DocsLink } from '../../../.storybook/docs/DocsContainerWrapper';
import type { TypedDocsContext } from '../../../.storybook/docs/utils';

interface CategoryListProps {
  category: string;
}

export function CategoryList({ category }: CategoryListProps) {
  const context = useContext(DocsContext) as TypedDocsContext;
  const store = context.store;
  const entries = store.storyIndex?.entries ?? {};

  const filteredEntries = Object.values(entries).filter(entry =>
    entry.title.startsWith(category)
  );

  const items = filteredEntries.map(entry => {
    const split = entry.title.split('/');
    const name = split[split.length - 1];

    return (
      <List.Item key={entry.id} pl={1}>
        <DocsLink href={`?path=/docs/${entry.id}`}>{name}</DocsLink>
      </List.Item>
    );
  });

  return (
    <List.Root mt={4} mb={6} pl={4}>
      {items}
    </List.Root>
  );
}
