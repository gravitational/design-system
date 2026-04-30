import {
  hashKey,
  useInfiniteQuery,
  type InfiniteData,
  type QueryKey,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';
import type { OnChangeFn, SortingState } from '@tanstack/react-table';
import { useState } from 'react';

export interface DataTableQueryContext<TPageParam> {
  pageParam: TPageParam;
  sorting: SortingState;
  filter: string;
  signal: AbortSignal;
}

export interface UseDataTableQueryOptions<TData, TPage, TPageParam> {
  queryKey: QueryKey;
  queryFn: (ctx: DataTableQueryContext<TPageParam>) => Promise<TPage> | TPage;
  initialPageParam: TPageParam;
  getNextPageParam: (
    lastPage: TPage,
    allPages: TPage[]
  ) => TPageParam | undefined | null;
  getPageRows: (page: TPage) => TData[];
  /** Returns the total row count for the "Showing X - Y of Z" text */
  getTotalCount?: (page: TPage) => number;
  pageSize?: number;
  initialSorting?: SortingState;
  initialGlobalFilter?: string;
  enabled?: boolean;
}

export interface DataTableServerSidePagination {
  /** Gets the previous page. */
  onPrev?: () => void;
  /** Gets the next page. */
  onNext?: () => void;
  isLoading: boolean;
  /** Index of the first row on the current page. */
  from: number;
  /** Index of the last row on the current page. */
  to: number;
  /** Total count of rows across all pages. */
  totalCount?: number;
}

export interface UseDataTableQueryResult<TData, TPage, TPageParam> {
  query: UseInfiniteQueryResult<InfiniteData<TPage, TPageParam>>;
  tableProps: {
    data: TData[];
    manualSorting: true;
    manualFiltering: true;
    state: { sorting: SortingState; globalFilter: string };
    onSortingChange: OnChangeFn<SortingState>;
    onGlobalFilterChange: OnChangeFn<string>;
    serverSidePagination: DataTableServerSidePagination;
  };
}

export function useDataTableQuery<TData, TPage, TPageParam = string>(
  options: UseDataTableQueryOptions<TData, TPage, TPageParam>
): UseDataTableQueryResult<TData, TPage, TPageParam> {
  const [pageIndex, setPageIndex] = useState(0);
  const [sorting, setSorting] = useState<SortingState>(
    options.initialSorting ?? []
  );
  const [globalFilter, setGlobalFilter] = useState<string>(
    options.initialGlobalFilter ?? ''
  );

  // Reset to first page when the sort or filter changes
  const queryKeyHash = hashKey(options.queryKey);
  const [prev, setPrev] = useState({ sorting, globalFilter, queryKeyHash });
  if (
    prev.sorting !== sorting ||
    prev.globalFilter !== globalFilter ||
    prev.queryKeyHash !== queryKeyHash
  ) {
    setPrev({ sorting, globalFilter, queryKeyHash });
    setPageIndex(0);
  }

  const query = useInfiniteQuery<
    TPage,
    Error,
    InfiniteData<TPage, TPageParam>,
    QueryKey,
    TPageParam
  >({
    queryKey: [...options.queryKey, { sorting, globalFilter }],
    queryFn: ctx =>
      options.queryFn({
        pageParam: ctx.pageParam as TPageParam,
        sorting,
        filter: globalFilter,
        signal: ctx.signal,
      }),
    initialPageParam: options.initialPageParam,
    getNextPageParam: options.getNextPageParam,
    enabled: options.enabled,
  });

  const pages = query.data?.pages ?? [];
  const currentPage = pages[pageIndex];
  const currentRows = currentPage ? options.getPageRows(currentPage) : [];
  const totalCount =
    currentPage && options.getTotalCount
      ? options.getTotalCount(currentPage)
      : undefined;

  const pageSize =
    options.pageSize ?? (pages[0] ? options.getPageRows(pages[0]).length : 0);
  const from = totalCount ? pageIndex * pageSize + 1 : 0;
  const to = totalCount ? from + currentRows.length - 1 : 0;

  const onPrev =
    pageIndex > 0
      ? () => {
          setPageIndex(i => i - 1);
        }
      : undefined;

  const hasCachedNext = pageIndex < pages.length - 1;
  const canGoNext = hasCachedNext || !!query.hasNextPage;

  const onNext = canGoNext
    ? () => {
        if (hasCachedNext) {
          setPageIndex(i => i + 1);
          return;
        }
        void query.fetchNextPage().then(result => {
          if (result.data && result.data.pages.length > pages.length) {
            setPageIndex(i => i + 1);
          }
        });
      }
    : undefined;

  return {
    query,
    tableProps: {
      data: currentRows,
      manualSorting: true,
      manualFiltering: true,
      state: { sorting, globalFilter },
      onSortingChange: setSorting,
      onGlobalFilterChange: setGlobalFilter,
      serverSidePagination: {
        onPrev,
        onNext,
        isLoading: query.isFetching,
        from,
        to,
        totalCount,
      },
    },
  };
}
