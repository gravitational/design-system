import type { Meta } from '@storybook/react-vite';

import { Box, Grid, GridItem, styled } from '../../../..';

const meta = {
  component: Grid,
} satisfies Meta<typeof Grid>;

export default meta;

export function Preview() {
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap="6">
      <Box h="20" bg="brand" />
      <Box h="20" bg="brand" />
      <Box h="20" bg="brand" />
    </Grid>
  );
}

Preview.tags = ['!dev'];

export function ColSpan() {
  return (
    <Grid templateColumns="repeat(4, 1fr)" gap="6">
      <GridItem colSpan={2}>
        <Box h="20" bg="brand" />
      </GridItem>
      <GridItem colSpan={1}>
        <Box h="20" bg="brand" />
      </GridItem>
      <GridItem colSpan={1}>
        <Box h="20" bg="brand" />
      </GridItem>
    </Grid>
  );
}

ColSpan.tags = ['!dev'];

const StyledGridItem = styled(GridItem, {
  base: {
    bg: 'brand',
    color: 'text.primaryInverse',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

export function SpanningColumns() {
  return (
    <Grid
      h="200px"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(5, 1fr)"
      gap={4}
      color="text.primaryInverse"
    >
      <StyledGridItem rowSpan={2} colSpan={1}>
        <Box>rowSpan=2</Box>
      </StyledGridItem>
      <StyledGridItem colSpan={2}>
        <Box>colSpan=2</Box>
      </StyledGridItem>
      <StyledGridItem colSpan={2}>
        <Box>colSpan=2</Box>
      </StyledGridItem>
      <StyledGridItem colSpan={4}>
        <Box>colSpan=4</Box>
      </StyledGridItem>
    </Grid>
  );
}

SpanningColumns.tags = ['!dev'];
