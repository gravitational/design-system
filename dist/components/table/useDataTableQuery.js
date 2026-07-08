import { useState } from "react";
import { hashKey, useInfiniteQuery } from "@tanstack/react-query";
//#region src/components/table/useDataTableQuery.ts
function useDataTableQuery(options) {
	const [pageIndex, setPageIndex] = useState(0);
	const [sorting, setSorting] = useState(options.initialSorting ?? []);
	const [globalFilter, setGlobalFilter] = useState(options.initialGlobalFilter ?? "");
	const queryKeyHash = hashKey(options.queryKey);
	const [prev, setPrev] = useState({
		sorting,
		globalFilter,
		queryKeyHash
	});
	if (prev.sorting !== sorting || prev.globalFilter !== globalFilter || prev.queryKeyHash !== queryKeyHash) {
		setPrev({
			sorting,
			globalFilter,
			queryKeyHash
		});
		setPageIndex(0);
	}
	const query = useInfiniteQuery({
		queryKey: [...options.queryKey, {
			sorting,
			globalFilter
		}],
		queryFn: (ctx) => options.queryFn({
			pageParam: ctx.pageParam,
			sorting,
			filter: globalFilter,
			signal: ctx.signal
		}),
		initialPageParam: options.initialPageParam,
		getNextPageParam: options.getNextPageParam,
		enabled: options.enabled
	});
	const pages = query.data?.pages ?? [];
	const currentPage = pages[pageIndex];
	const currentRows = currentPage ? options.getPageRows(currentPage) : [];
	const totalCount = currentPage && options.getTotalCount ? options.getTotalCount(currentPage) : void 0;
	const pageSize = options.pageSize ?? (pages[0] ? options.getPageRows(pages[0]).length : 0);
	const from = totalCount ? pageIndex * pageSize + 1 : 0;
	const to = totalCount ? from + currentRows.length - 1 : 0;
	const onPrev = pageIndex > 0 ? () => {
		setPageIndex((i) => i - 1);
	} : void 0;
	const hasCachedNext = pageIndex < pages.length - 1;
	const onNext = hasCachedNext || !!query.hasNextPage ? () => {
		if (hasCachedNext) {
			setPageIndex((i) => i + 1);
			return;
		}
		const fromIndex = pageIndex;
		setPageIndex(fromIndex + 1);
		query.fetchNextPage().then((result) => {
			if (result.isError) setPageIndex((current) => current === fromIndex + 1 ? fromIndex : current);
		});
	} : void 0;
	return {
		query,
		tableProps: {
			data: currentRows,
			manualSorting: true,
			manualFiltering: true,
			state: {
				sorting,
				globalFilter
			},
			onSortingChange: setSorting,
			onGlobalFilterChange: setGlobalFilter,
			serverSidePagination: {
				onPrev,
				onNext,
				isLoading: query.isFetching,
				from,
				to,
				totalCount
			}
		}
	};
}
//#endregion
export { useDataTableQuery };

//# sourceMappingURL=useDataTableQuery.js.map