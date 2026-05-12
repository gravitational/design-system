import { chakra, VStack } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { http, HttpResponse } from 'msw';
import { useMemo, useState } from 'react';
import { expect, waitFor } from 'storybook/test';

const queryClient = new QueryClient();

import {
  DataTable,
  LabelCell,
  SortableHeader,
  TextCell,
  useDataTableQuery,
  type ColumnDef,
} from '../../../../components';

interface Row {
  id: number;
  name: string;
  labels: string[];
}

function makeRows(count: number): Row[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Row ${i + 1}`,
    labels: [`Label ${i + 1}`, `Label ${i + 2}`],
  }));
}

const meta: Meta<typeof DataTable<Row>> = {
  component: DataTable,
  args: { columns: [], data: [], emptyText: '' },
};

export default meta;

const columns: ColumnDef<Row>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <TextCell data={row.original.name} />,
  },
  {
    accessorKey: 'labels',
    header: 'Labels',
    cell: ({ row }) => <LabelCell data={row.original.labels} />,
  },
];

const sortableColumns: ColumnDef<Row>[] = [
  {
    accessorKey: 'name',
    header: ({ header }) => (
      <SortableHeader header={header}>Name</SortableHeader>
    ),
    cell: ({ row }) => <TextCell data={row.original.name} />,
  },
  {
    accessorKey: 'labels',
    header: 'Labels',
    cell: ({ row }) => <LabelCell data={row.original.labels} />,
    enableSorting: false,
  },
];

export function Basic() {
  const data = useMemo(() => makeRows(5), []);
  return (
    <Container>
      <DataTable data={data} columns={columns} emptyText="No data" />
    </Container>
  );
}

Basic.tags = ['!dev'];

export function Searchable() {
  const data = useMemo(() => makeRows(12), []);
  return (
    <Container>
      <DataTable
        data={data}
        columns={columns}
        emptyText="No matches"
        isSearchable
      />
    </Container>
  );
}

Searchable.tags = ['!dev'];

export function ClientSidePagination() {
  const data = useMemo(() => makeRows(23), []);
  return (
    <Container>
      <DataTable
        data={data}
        columns={columns}
        emptyText="No data"
        clientSidePagination={{ pageSize: 5, pagerPosition: 'both' }}
        isSearchable
      />
    </Container>
  );
}

ClientSidePagination.tags = ['!dev'];

export function CustomSorting() {
  const data = useMemo(() => makeRows(8), []);
  return (
    <Container>
      <DataTable
        data={data}
        columns={sortableColumns}
        emptyText="No data"
        initialState={{ sorting: [{ id: 'name', desc: false }] }}
      />
    </Container>
  );
}

CustomSorting.tags = ['!dev'];

export function EmptyState() {
  return (
    <Container>
      <DataTable data={[]} columns={columns} emptyText="No data" />
    </Container>
  );
}

EmptyState.tags = ['!dev'];

export function LoadingState() {
  return (
    <Container>
      <DataTable data={[]} columns={columns} emptyText="No data" isLoading />
    </Container>
  );
}

LoadingState.tags = ['!dev'];

export function InteractiveRows() {
  const data = useMemo(() => makeRows(5), []);
  const [clicked, setClicked] = useState<Row | null>(null);
  return (
    <Container>
      <DataTable
        data={data}
        columns={columns}
        emptyText="No data"
        row={{
          onClick: setClicked,
          getStyle: () => ({ cursor: 'pointer' }),
        }}
      />
      <chakra.div mt={4} color="text.slightlyMuted">
        Last clicked: {clicked ? clicked.name : 'none'}
      </chakra.div>
    </Container>
  );
}

InteractiveRows.tags = ['!dev'];

interface PaginatedResponse {
  items: Row[];
  startKey: string;
  totalCount: number;
}

const SERVER_PAGE_SIZE = 5;
const SERVER_TOTAL = 15;

export function ServerSidePagination() {
  const { tableProps } = useDataTableQuery({
    queryKey: ['rows'],
    queryFn: async ({ pageParam, filter, signal }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set('startKey', pageParam);
      if (filter) params.set('filter', filter);
      const response = await fetch(`/api/rows?${params}`, { signal });
      return (await response.json()) as PaginatedResponse;
    },
    initialPageParam: '',
    getNextPageParam: last => last.startKey || undefined,
    getPageRows: page => page.items,
    getTotalCount: page => page.totalCount,
    pageSize: SERVER_PAGE_SIZE,
  });

  return (
    <Container>
      <DataTable
        {...tableProps}
        columns={columns}
        emptyText="No data"
        isSearchable
      />
    </Container>
  );
}

ServerSidePagination.tags = ['!dev'];
ServerSidePagination.parameters = {
  msw: {
    handlers: [
      http.get('/api/rows', ({ request }) => {
        const url = new URL(request.url);
        const startKey = url.searchParams.get('startKey') ?? '';
        const filter = url.searchParams.get('filter')?.toLowerCase() ?? '';

        const all = makeRows(SERVER_TOTAL).filter(r =>
          filter ? r.name.toLowerCase().includes(filter) : true
        );
        const start = startKey ? Number(startKey) : 0;
        const end = Math.min(start + SERVER_PAGE_SIZE, all.length);

        return HttpResponse.json<PaginatedResponse>({
          items: all.slice(start, end),
          startKey: end < all.length ? String(end) : '',
          totalCount: all.length,
        });
      }),
    ],
  },
};
ServerSidePagination.decorators = [
  function WithQueryClient(Story: () => React.ReactElement) {
    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  },
];

function Container({ children }: { children: React.ReactNode }) {
  return (
    <VStack align="stretch" minW="720px">
      {children}
    </VStack>
  );
}

// Unit tests
const testTags = ['!dev', '!docs'];

// All static rows passed in via `data` are visible
export const BasicTest: StoryObj<typeof meta> = {
  tags: testTags,
  render: Basic,
  play: async ({ canvas }) => {
    for (let i = 1; i <= 5; i++) {
      await expect(canvas.getByText(`Row ${i}`)).toBeInTheDocument();
    }
  },
};

// If `data` is empty, the empty state text is shown
export const EmptyStateTest: StoryObj<typeof meta> = {
  tags: testTags,
  render: EmptyState,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No data')).toBeInTheDocument();
  },
};

// Client-side pagination only renders the rows for the current page, and clicking
// the Next button shows the next 5 items
export const ClientSidePaginationTest: StoryObj<typeof meta> = {
  tags: testTags,
  render: ClientSidePagination,
  play: async ({ canvas, userEvent }) => {
    // Only rows 1–5 visible on first page
    await expect(canvas.getByText('Row 1')).toBeInTheDocument();
    await expect(canvas.getByText('Row 5')).toBeInTheDocument();
    await expect(canvas.queryByText('Row 6')).not.toBeInTheDocument();

    // There should be 2 pagers (top and bottom)
    const nextButtons = canvas.getAllByTitle('Next page');
    await expect(nextButtons).toHaveLength(2);

    // Navigating to the next page shows rows 6-10
    await userEvent.click(nextButtons[0]);
    await waitFor(async () => {
      await expect(canvas.getByText('Row 6')).toBeInTheDocument();
      await expect(canvas.getByText('Row 10')).toBeInTheDocument();
    });
  },
};

export const ServerSidePaginationTest: StoryObj<typeof meta> = {
  tags: testTags,
  render: ServerSidePagination,
  parameters: ServerSidePagination.parameters,
  decorators: ServerSidePagination.decorators,
  play: async ({ canvas, userEvent }) => {
    // First fetch returns page 1 (row 1-5)
    await waitFor(
      async () => {
        await expect(canvas.getByText('Row 1')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    await expect(canvas.getByText('Row 5')).toBeInTheDocument();

    await waitFor(async () => {
      await expect(canvas.getAllByTitle('Next page')[0]).not.toBeDisabled();
    });
    await userEvent.click(canvas.getAllByTitle('Next page')[0]);

    // Second fetch returns page 2 (row 6-10)
    await waitFor(
      async () => {
        await expect(canvas.getByText('Row 6')).toBeInTheDocument();
        await expect(canvas.getByText('Row 10')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  },
};

export const SearchableTest: StoryObj<typeof meta> = {
  tags: testTags,
  render: Searchable,
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('textbox'), 'Row 3{Enter}');
    await waitFor(async () => {
      await expect(canvas.getByText('Row 3')).toBeInTheDocument();
      await expect(canvas.queryByText('Row 1')).not.toBeInTheDocument();
    });
  },
};

// Clicking a sortable column header toggles the sort direction
export const SortingTest: StoryObj<typeof meta> = {
  tags: testTags,
  render: CustomSorting,
  play: async ({ canvas, userEvent }) => {
    const header = canvas.getByRole('columnheader', { name: /name/i });
    await expect(header).toHaveAttribute('aria-sort', 'ascending');

    await userEvent.click(canvas.getByRole('button', { name: /name/i }));
    await expect(header).toHaveAttribute('aria-sort', 'descending');
  },
};
