import { type InfiniteData, type QueryKey, type UseInfiniteQueryResult } from '@tanstack/react-query';
import type { OnChangeFn, SortingState } from '@tanstack/react-table';
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
    getNextPageParam: (lastPage: TPage, allPages: TPage[]) => TPageParam | undefined | null;
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
    /**
     * 1-based index of the first row on the current page (inclusive).
     * `0` when there are no rows.
     */
    from: number;
    /**
     * 1-based index of the last row on the current page (inclusive).
     * `0` when there are no rows.
     */
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
        state: {
            sorting: SortingState;
            globalFilter: string;
        };
        onSortingChange: OnChangeFn<SortingState>;
        onGlobalFilterChange: OnChangeFn<string>;
        serverSidePagination: DataTableServerSidePagination;
    };
}
export declare function useDataTableQuery<TData, TPage, TPageParam = string>(options: UseDataTableQueryOptions<TData, TPage, TPageParam>): UseDataTableQueryResult<TData, TPage, TPageParam>;
