import { Box, IconButton } from '@chakra-ui/react';
import {
  DocsContext,
  SourceContext,
  Story,
  useOf,
  useSourceProps,
  type SourceProps,
  type StoryProps,
} from '@storybook/addon-docs/blocks';
import { useContext, useState, type PropsWithChildren } from 'react';
import type { ModuleExport, ModuleExports } from 'storybook/internal/types';

import { CodeBlock } from '../../../.storybook/docs/CodeBlock';
import { CodeIcon, Tooltip } from '../../index';

interface CanvasProps {
  of?: ModuleExport;
  meta?: ModuleExports;
  source?: SourceProps;
  story?: StoryProps;
}

export function Canvas(props: PropsWithChildren<CanvasProps>) {
  const docsContext = useContext(DocsContext);
  const sourceContext = useContext(SourceContext);

  const [showSource, setShowSource] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { of, source } = props;

  if ('of' in props && of === undefined) {
    throw new Error(
      'Unexpected `of={undefined}`, did you mistype a CSF file reference?'
    );
  }

  const { story } = useOf(of ?? 'story', ['story']);

  const sourceProps = useSourceProps(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    { ...source, ...(of && { of }) },
    docsContext,
    sourceContext
  );

  return (
    <Box my={5} pos="relative" overflow="hidden">
      {sourceProps.code && (
        <Tooltip
          content={showSource ? 'Hide code' : 'Show code'}
          openDelay={0}
          positioning={{
            placement: 'left',
          }}
          closeDelay={0}
          closeOnClick={false}
        >
          <IconButton
            pos="absolute"
            top={1}
            right={1}
            px={1}
            py={1}
            size="sm"
            fill="minimal"
            intent="neutral"
            onClick={() => {
              setShowSource(!showSource);
            }}
            zIndex={1}
          >
            <CodeIcon />
          </IconButton>
        </Tooltip>
      )}

      <Box
        border="1px solid {colors.interactive.tonal.neutral.1}"
        borderRadius="md"
        borderBottom={
          showSource ? 'none' : '1px solid {colors.interactive.tonal.neutral.1}'
        }
        borderBottomRadius={showSource ? 'none' : 'md'}
        p={4}
      >
        <Story
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
          of={of ?? story.moduleExport}
          meta={props.meta}
          {...props.story}
        />
      </Box>

      {showSource && sourceProps.code && (
        <CodeBlock borderTopRadius="none" mt={0} mb={0}>
          {sourceProps.code}
        </CodeBlock>
      )}
    </Box>
  );
}
