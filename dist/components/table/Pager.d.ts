export interface PagerProps {
    onPrev?: () => void;
    onNext?: () => void;
    isLoading?: boolean;
    /** Index of the first row on the current page. */
    from?: number;
    /** Index of the last row on the current page. */
    to?: number;
    /** Total count of rows. */
    totalCount?: number;
}
export declare function Pager({ onPrev, onNext, isLoading, from, to, totalCount, }: PagerProps): import("react/jsx-runtime").JSX.Element;
