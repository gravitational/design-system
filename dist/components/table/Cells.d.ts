import type { Header } from '@tanstack/react-table';
import type { ReactNode } from 'react';
export interface LabelDescription {
    name: string;
    value: string;
}
export declare function TextCell({ data, }: {
    data: string | number | null | undefined;
}): import("react/jsx-runtime").JSX.Element;
export declare function LabelCell({ data }: {
    data: string[];
}): import("react/jsx-runtime").JSX.Element;
export declare function ClickableLabelCell({ labels, onClick, }: {
    labels: LabelDescription[];
    onClick: (label: LabelDescription) => void;
}): import("react/jsx-runtime").JSX.Element;
export interface SortableHeaderProps<TData, TValue> {
    header: Header<TData, TValue>;
    children: ReactNode;
}
/**
 * Renders a column header with a sort indicator.
 */
export declare function SortableHeader<TData, TValue>({ header, children, }: SortableHeaderProps<TData, TValue>): import("react/jsx-runtime").JSX.Element;
