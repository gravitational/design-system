import { Box, Text } from '@chakra-ui/react';
import { Story, useOf } from '@storybook/addon-docs/blocks';
import { useRef } from 'react';
import type { ModuleExport } from 'storybook/internal/types';

import { Flex, Grid, Heading } from '../../components';

interface ExplorerProps {
  of?: ModuleExport;
  keys: string[];
}

export function Explorer({ of, keys }: ExplorerProps) {
  const { story } = useOf(of ?? 'story', ['story']);
  const ref = useRef<HTMLDivElement>(null);

  function handleHover(key: string) {
    if (!ref.current) {
      return;
    }

    const element = ref.current.querySelector(`[data-part="${key}"]`);

    if (element instanceof HTMLElement || element instanceof SVGElement) {
      element.style.outline = '2px solid var(--teleport-colors-red-500)';
    }
  }

  function handleMouseOut(key: string) {
    if (!ref.current) {
      return;
    }

    const element = ref.current.querySelector(`[data-part="${key}"]`);

    if (element instanceof HTMLElement || element instanceof SVGElement) {
      element.style.outline = '';
    }
  }

  const items = keys.map(key => (
    <Box
      bg="interactive.tonal.neutral.0"
      key={key}
      px={2}
      py={1}
      borderRadius="sm"
      fontSize="md"
      fontWeight="bold"
      cursor="pointer"
      borderWidth="1px"
      borderColor="transparent"
      _hover={{
        bg: 'interactive.tonal.neutral.1',
        borderColor: 'interactive.tonal.neutral.1',
      }}
      onMouseEnter={() => {
        handleHover(key);
      }}
      onMouseLeave={() => {
        handleMouseOut(key);
      }}
    >
      {capitalize(key)}
    </Box>
  ));

  return (
    <Flex
      borderRadius="md"
      borderWidth="1px"
      borderColor="interactive.tonal.neutral.1"
      gap={4}
      overflow="hidden"
    >
      <Grid flex={1} placeItems="center" py={4} ref={ref}>
        <Story
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
          of={of ?? story.moduleExport}
        />
      </Grid>
      <Flex
        flexDirection="column"
        gap={2}
        bg="levels.surface"
        flexBasis="md"
        p={4}
        borderLeftWidth="1px"
        borderColor="interactive.tonal.neutral.0"
      >
        <Heading size="sm" fontWeight="bold" className="skip-toc">
          Component Anatomy
        </Heading>

        <Text>Hover to highlight</Text>

        <Flex gap={4} flexWrap="wrap" mt={2}>
          {items}
        </Flex>
      </Flex>
    </Flex>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
