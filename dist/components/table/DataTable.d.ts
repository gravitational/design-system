import { type ColumnDef, type TableOptions } from '@tanstack/react-table';
import type { CSSProperties, ReactNode } from 'react';
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
    renderCustomCells?: (row: T) => ReactNode;
    /** Render a component after the row. */
    renderAfter?: (row: T) => ReactNode | null;
}
export interface DataTableProps<TData> extends Omit<TableOptions<TData>, 'data' | 'columns' | 'getCoreRowModel'> {
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
export declare function DataTable<TData>({ data, columns, emptyText, isLoading, isSearchable, searchPanel, clientSidePagination, serverSidePagination, row, className, style, ...tanstackOptions }: DataTableProps<TData>): import("react/jsx-runtime").JSX.Element;
