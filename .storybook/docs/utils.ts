import { DocsContext } from '@storybook/addon-docs/blocks';
import { useContext } from 'react';
import type { DocsContextProps, IndexEntry } from 'storybook/internal/types';

export interface StorybookStore {
  storyIndex?: {
    entries: Record<string, IndexEntry>;
  };
}

export interface TypedDocsContext extends DocsContextProps {
  store: StorybookStore;
}

export function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const path = params.get('path') ?? params.get('id');

  if (path) {
    const segments = path.split('/').filter(Boolean);
    return segments[segments.length - 1];
  }

  const viewMode = params.get('viewMode');
  const id = params.get('id');

  if (viewMode === 'docs' && id) {
    return id;
  }

  return null;
}

export function useCurrentEntry() {
  const context = useContext(DocsContext) as TypedDocsContext;
  const store = context.store;
  const currentId = getIdFromUrl();

  return Object.values(store.storyIndex?.entries ?? {}).find(
    entry => entry.id === currentId
  );
}
