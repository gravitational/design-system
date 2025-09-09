import type { PropsWithChildren } from 'react';

export function DocsStory(props: PropsWithChildren) {
  return <div style={{ padding: '200px' }}>{props.children}</div>;
}
