import { HStack, Spacer, Text, VStack } from '@chakra-ui/react';
import { DocsContext } from '@storybook/addon-docs/blocks';
import { useContext, useMemo, type MouseEvent } from 'react';
import { NAVIGATE_URL } from 'storybook/internal/core-events';
import type { IndexEntry } from 'storybook/internal/types';

import { CaretLeftIcon, CaretRightIcon } from '../../src';
import preview from '../preview';
import { getIdFromUrl, type TypedDocsContext } from './utils';

interface NavigationItemProps {
  title: string;
  next: boolean;
  id: string;
  onClick: (event: MouseEvent) => void;
}

function NavigationItem({ id, onClick, title, next }: NavigationItemProps) {
  const text = next ? 'Next' : 'Previous';
  const icon = next ? <CaretRightIcon /> : <CaretLeftIcon />;

  return (
    <VStack
      asChild
      onClick={onClick}
      align={next ? 'flex-end' : 'flex-start'}
      borderRadius="md"
      border="1px solid {colors.interactive.tonal.neutral.1}"
      flex={1}
      px={4}
      gap={1}
      pt={3}
      pb={4}
      minWidth="200px"
      _hover={{ bg: 'interactive.tonal.neutral.1' }}
    >
      <a href={`/?path=/docs/${id}`}>
        <Text color="text.slightlyMuted" fontSize="sm">
          {text}
        </Text>

        <HStack fontWeight="bold">
          {!next && icon}
          {title}
          {next && icon}
        </HStack>
      </a>
    </VStack>
  );
}

function getItemTitle(item: IndexEntry) {
  const path = item.title.split('/');

  return path[path.length - 1];
}

export function DocsNavigation() {
  const context = useContext(DocsContext) as TypedDocsContext;
  const store = context.store;
  const currentId = getIdFromUrl();

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const { prev, next } = useMemo(() => {
    if (!store.storyIndex?.entries || !currentId) {
      return { prev: null, next: null };
    }

    const entries = Object.values(store.storyIndex.entries);
    const orderedEntries = entries.toSorted(
      preview.parameters.options.storySort
    );

    const currentIndex = orderedEntries.findIndex(
      entry => entry.id === currentId
    );

    if (currentIndex === -1) {
      return { prev: null, next: null };
    }

    return {
      prev: orderedEntries[currentIndex - 1] ?? null,
      next: orderedEntries[currentIndex + 1] ?? null,
    };
  }, [store.storyIndex?.entries, currentId]);

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
      // use the A element's href, which has been modified for
      // local paths without a `?path=` query param prefix
      context.channel.emit(
        NAVIGATE_URL,
        event.currentTarget.getAttribute('href') ?? ''
      );
    }
  }

  return (
    <HStack w="100%" justify="space-between" gap={10} mt={8} mb={8}>
      {prev ? (
        <NavigationItem
          id={prev.id}
          title={getItemTitle(prev)}
          next={false}
          onClick={handleClick}
        />
      ) : (
        <Spacer />
      )}

      {next ? (
        <NavigationItem
          id={next.id}
          title={getItemTitle(next)}
          next={true}
          onClick={handleClick}
        />
      ) : (
        <Spacer />
      )}
    </HStack>
  );
}
