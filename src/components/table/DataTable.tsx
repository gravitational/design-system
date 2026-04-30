import { chakra, Spinner, Table } from '@chakra-ui/react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
  type Table as TanstackTable,
  type TableOptions,
} from '@tanstack/react-table';
import type { CSSProperties, ReactNode } from 'react';

import { DatabaseIcon } from '../../icons';
import { InputSearch } from './InputSearch';
import { Pager, type PagerProps } from './Pager';
import type { DataTableServerSidePagination } from './useDataTableQuery';

export type PagerPosition = 'top' | 'bottom' | 'both';

export interface DataTablePagination {
  pageSize?: number;
  pagerPosition?: PagerPosition;
}

export interface DataTableRowOptions<T> {
  onClick?: (row: T) => void;
  getStyle?: (row: T) => CSSProperties;
  /** Render a custom component instead of the default row. */
  customRow?: (row: T) => ReactNode;
  /** Render a component after the row. */
  renderAfter?: (row: T) => ReactNode | null;
}

export interface DataTableProps<TData> extends Omit<
  TableOptions<TData>,
  'data' | 'columns' | 'getCoreRowModel'
> {
  columns: ColumnDef<TData>[];
  data: TData[];
  emptyText: string;
  isLoading?: boolean;
  /** Whether to include the client-side search input. */
  isSearchable?: boolean;
  /**
   * Custom search input.
   */
  searchPanel?: ReactNode;
  clientSidePagination?: DataTablePagination;
  serverSidePagination?: DataTableServerSidePagination;
  row?: DataTableRowOptions<TData>;
  className?: string;
  style?: CSSProperties;
}

export function DataTable<TData>({
  data,
  columns,
  emptyText,
  isLoading,
  isSearchable,
  searchPanel,
  clientSidePagination,
  serverSidePagination,
  row,
  className,
  style,
  ...tanstackOptions
}: DataTableProps<TData>) {
  const hasClientPagination = clientSidePagination !== undefined;

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(hasClientPagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    ...tanstackOptions,
    initialState: {
      ...(clientSidePagination?.pageSize != null && {
        pagination: {
          pageIndex: 0,
          pageSize: clientSidePagination.pageSize,
        },
      }),
      ...tanstackOptions.initialState,
    },
  });

  const rows = table.getRowModel().rows;
  const visibleColumnCount = table.getVisibleLeafColumns().length;

  const totalRowCount = serverSidePagination?.totalCount ?? table.getRowCount();

  const pagerPosition = clientSidePagination?.pagerPosition;
  const { showTopPager, showBottomPager, showBothPager } = getPagerPosition(
    pagerPosition,
    totalRowCount
  );
  const hasPagerVisible =
    hasClientPagination || serverSidePagination !== undefined;
  const topPager = hasPagerVisible && (showTopPager || showBothPager);
  const bottomPager = hasPagerVisible && (showBottomPager || showBothPager);
  const hasTopPanel = !!searchPanel || !!isSearchable || topPager;

  const isFetching = isLoading ?? serverSidePagination?.isLoading ?? false;
  const isInitialLoading = isFetching && data.length === 0;

  const globalFilter =
    (table.getState().globalFilter as string | undefined) ?? '';

  const pagerProps: PagerProps =
    serverSidePagination ?? buildClientPagerProps(table);

  return (
    <>
      {hasTopPanel && (
        <Panel>
          {searchPanel ??
            (isSearchable && (
              <InputSearch
                searchValue={globalFilter}
                setSearchValue={value => {
                  table.setGlobalFilter(value);
                }}
              />
            ))}
          {topPager && <Pager {...pagerProps} />}
        </Panel>
      )}

      <Table.Root className={className} style={style}>
        <Table.Header>
          {table.getHeaderGroups().map(headerGroup => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const sorted = header.column.getIsSorted();
                const ariaSort =
                  sorted === 'asc'
                    ? 'ascending'
                    : sorted === 'desc'
                      ? 'descending'
                      : header.column.getCanSort()
                        ? 'none'
                        : undefined;
                return (
                  <Table.ColumnHeader
                    key={header.id}
                    colSpan={header.colSpan}
                    aria-sort={ariaSort}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </Table.ColumnHeader>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>
        {renderBody({
          rows,
          row,
          isInitialLoading,
          emptyText,
          colSpan: visibleColumnCount,
        })}
      </Table.Root>

      {bottomPager && (
        <Panel>
          <Pager {...pagerProps} />
        </Panel>
      )}
    </>
  );
}

function renderBody<T>({
  rows,
  row,
  isInitialLoading,
  emptyText,
  colSpan,
}: {
  rows: Row<T>[];
  row?: DataTableRowOptions<T>;
  isInitialLoading: boolean;
  emptyText: string;
  colSpan: number;
}) {
  if (isInitialLoading) {
    return <LoadingIndicator colSpan={colSpan} />;
  }

  if (rows.length === 0) {
    return <EmptyIndicator emptyText={emptyText} colSpan={colSpan} />;
  }

  return (
    <Table.Body>
      {rows.flatMap(r => {
        const item = r.original;
        const customRow = row?.customRow?.(item);
        const renderAfter = row?.renderAfter?.(item);

        const rowNode = (
          <Table.Row
            key={r.id}
            onClick={() => row?.onClick?.(item)}
            style={row?.getStyle?.(item)}
          >
            {customRow ??
              r
                .getVisibleCells()
                .map(cell => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
          </Table.Row>
        );

        if (renderAfter) {
          return [
            rowNode,
            <Table.Row key={`${r.id}-after`}>{renderAfter}</Table.Row>,
          ];
        }
        return [rowNode];
      })}
    </Table.Body>
  );
}

function EmptyIndicator({
  emptyText,
  colSpan,
}: {
  emptyText: string;
  colSpan: number;
}) {
  return (
    <Table.Footer>
      <Table.Row>
        <Table.Cell colSpan={colSpan}>
          <chakra.div
            m={5}
            display="flex"
            gap={4}
            flexWrap="nowrap"
            alignItems="flex-start"
            justifyContent="center"
          >
            <DatabaseIcon
              color="text.main"
              boxSize={8}
              css={{ lineHeight: '{sizes.8}' }}
            />
            <chakra.div
              textAlign="center"
              textStyle="h1"
              m={0}
              color="text.main"
            >
              {emptyText}
            </chakra.div>
          </chakra.div>
        </Table.Cell>
      </Table.Row>
    </Table.Footer>
  );
}

function LoadingIndicator({ colSpan }: { colSpan: number }) {
  return (
    <Table.Footer>
      <Table.Row>
        <Table.Cell colSpan={colSpan}>
          <chakra.div m={5} textAlign="center">
            <Spinner />
          </chakra.div>
        </Table.Cell>
      </Table.Row>
    </Table.Footer>
  );
}

const Panel = chakra('nav', {
  base: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 0 16px 0',
    maxHeight: 10,
    marginTop: 1,
  },
});

/**
 * Returns pager position flags.
 *
 * If pagerPosition is not defined, it defaults to:
 *   - top pager only: if current dataLen < 5
 *   - both top and bottom pager if dataLen > 5
 */
function getPagerPosition(
  pagerPosition: PagerPosition | undefined,
  rowCount: number
) {
  const hasSufficientData = rowCount > 5;
  const showBottomPager = pagerPosition === 'bottom';
  const showTopPager =
    pagerPosition === 'top' || (!pagerPosition && !hasSufficientData);
  const showBothPager =
    pagerPosition === 'both' || (!pagerPosition && hasSufficientData);
  return { showTopPager, showBottomPager, showBothPager };
}

function buildClientPagerProps<T>(table: TanstackTable<T>): PagerProps {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalCount = table.getRowCount();
  const from = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalCount);
  return {
    onPrev: table.getCanPreviousPage()
      ? () => {
          table.previousPage();
        }
      : undefined,
    onNext: table.getCanNextPage()
      ? () => {
          table.nextPage();
        }
      : undefined,
    from,
    to,
    totalCount,
  };
}
