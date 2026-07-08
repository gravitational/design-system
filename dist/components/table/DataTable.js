import { DatabaseIcon } from "../../icons/generated/DatabaseIcon.js";
import "../../icons/index.js";
import { InputSearch } from "./InputSearch.js";
import { Pager } from "./Pager.js";
import { Spinner, Table, chakra } from "@chakra-ui/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
//#region src/components/table/DataTable.tsx
function DataTable({ data, columns, emptyText, isLoading, isSearchable, searchPanel, clientSidePagination, serverSidePagination, row, className, style, ...tanstackOptions }) {
	const hasClientPagination = clientSidePagination !== void 0;
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		...hasClientPagination && { getPaginationRowModel: getPaginationRowModel() },
		...tanstackOptions,
		initialState: {
			...clientSidePagination?.pageSize != null && { pagination: {
				pageIndex: 0,
				pageSize: clientSidePagination.pageSize
			} },
			...tanstackOptions.initialState
		}
	});
	const rows = table.getRowModel().rows;
	const visibleColumnCount = table.getVisibleLeafColumns().length;
	const totalRowCount = serverSidePagination?.totalCount ?? table.getRowCount();
	const pagerPosition = clientSidePagination?.pagerPosition;
	const { showTopPager, showBottomPager, showBothPagers } = getPagerPosition(pagerPosition, totalRowCount);
	const hasPagerVisible = hasClientPagination || serverSidePagination !== void 0;
	const topPager = hasPagerVisible && (showTopPager || showBothPagers);
	const bottomPager = hasPagerVisible && (showBottomPager || showBothPagers);
	const hasTopPanel = !!searchPanel || !!isSearchable || topPager;
	const isInitialLoading = (isLoading ?? serverSidePagination?.isLoading ?? false) && data.length === 0;
	const globalFilter = table.getState().globalFilter ?? "";
	const pagerProps = serverSidePagination ?? buildClientPagerProps(table);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		hasTopPanel && /* @__PURE__ */ jsxs(Panel, { children: [searchPanel ?? (isSearchable && /* @__PURE__ */ jsx(InputSearch, {
			searchValue: globalFilter,
			setSearchValue: (value) => {
				table.setGlobalFilter(value);
			}
		})), topPager && /* @__PURE__ */ jsx(Pager, { ...pagerProps })] }),
		/* @__PURE__ */ jsxs(Table.Root, {
			className,
			style,
			children: [/* @__PURE__ */ jsx(Table.Header, { children: table.getHeaderGroups().map((headerGroup) => /* @__PURE__ */ jsx(Table.Row, { children: headerGroup.headers.map((header) => /* @__PURE__ */ jsx(Table.ColumnHeader, {
				colSpan: header.colSpan,
				"aria-sort": getAriaSort(header.column.getIsSorted()),
				children: header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())
			}, header.id)) }, headerGroup.id)) }), renderBody({
				rows,
				rowOptions: row,
				isInitialLoading,
				emptyText,
				numColumns: visibleColumnCount
			})]
		}),
		bottomPager && /* @__PURE__ */ jsx(Panel, { children: /* @__PURE__ */ jsx(Pager, { ...pagerProps }) })
	] });
}
function renderBody({ rows, rowOptions, isInitialLoading, emptyText, numColumns }) {
	if (isInitialLoading) return /* @__PURE__ */ jsx(LoadingIndicator, { colSpan: numColumns });
	if (rows.length === 0) return /* @__PURE__ */ jsx(EmptyIndicator, {
		emptyText,
		colSpan: numColumns
	});
	return /* @__PURE__ */ jsx(Table.Body, { children: rows.flatMap((r) => {
		const item = r.original;
		const customCells = rowOptions?.renderCustomCells?.(item);
		const renderAfter = rowOptions?.renderAfter?.(item);
		const rowNode = /* @__PURE__ */ jsx(Table.Row, {
			onClick: () => rowOptions?.onClick?.(item),
			style: rowOptions?.getStyle?.(item),
			children: customCells ?? r.getVisibleCells().map((cell) => /* @__PURE__ */ jsx(Table.Cell, { children: flexRender(cell.column.columnDef.cell, cell.getContext()) }, cell.id))
		}, r.id);
		if (renderAfter) return [rowNode, /* @__PURE__ */ jsx(Table.Row, { children: renderAfter }, `${r.id}-after`)];
		return [rowNode];
	}) });
}
function EmptyIndicator({ emptyText, colSpan }) {
	return /* @__PURE__ */ jsx(Table.Footer, { children: /* @__PURE__ */ jsx(Table.Row, { children: /* @__PURE__ */ jsx(Table.Cell, {
		colSpan,
		children: /* @__PURE__ */ jsxs(chakra.div, {
			m: 5,
			display: "flex",
			gap: 4,
			flexWrap: "nowrap",
			alignItems: "flex-start",
			justifyContent: "center",
			children: [/* @__PURE__ */ jsx(DatabaseIcon, {
				color: "text.main",
				boxSize: 8,
				css: { lineHeight: "{sizes.8}" }
			}), /* @__PURE__ */ jsx(chakra.div, {
				textAlign: "center",
				textStyle: "h1",
				m: 0,
				color: "text.main",
				children: emptyText
			})]
		})
	}) }) });
}
function LoadingIndicator({ colSpan }) {
	return /* @__PURE__ */ jsx(Table.Footer, { children: /* @__PURE__ */ jsx(Table.Row, { children: /* @__PURE__ */ jsx(Table.Cell, {
		colSpan,
		children: /* @__PURE__ */ jsx(chakra.div, {
			m: 5,
			textAlign: "center",
			children: /* @__PURE__ */ jsx(Spinner, {})
		})
	}) }) });
}
const Panel = chakra("nav", { base: {
	display: "flex",
	flexShrink: 0,
	alignItems: "center",
	justifyContent: "space-between",
	padding: "0 0 16px 0",
	maxHeight: 10,
	marginTop: 1
} });
function getAriaSort(sorted) {
	switch (sorted) {
		case "asc": return "ascending";
		case "desc": return "descending";
		default: return;
	}
}
/**
* Returns pager position flags.
*
* If pagerPosition is not defined, it defaults to:
*   - top pager only: if current dataLen < 5
*   - both top and bottom pager if dataLen > 5
*/
function getPagerPosition(pagerPosition, rowCount) {
	const hasSufficientData = rowCount > 5;
	return {
		showTopPager: pagerPosition === "top" || !pagerPosition && !hasSufficientData,
		showBottomPager: pagerPosition === "bottom",
		showBothPagers: pagerPosition === "both" || !pagerPosition && hasSufficientData
	};
}
function buildClientPagerProps(table) {
	const { pageIndex, pageSize } = table.getState().pagination;
	const totalCount = table.getRowCount();
	const from = totalCount === 0 ? 0 : pageIndex * pageSize + 1;
	const to = Math.min((pageIndex + 1) * pageSize, totalCount);
	return {
		onPrev: table.getCanPreviousPage() ? () => {
			table.previousPage();
		} : void 0,
		onNext: table.getCanNextPage() ? () => {
			table.nextPage();
		} : void 0,
		from,
		to,
		totalCount
	};
}
//#endregion
export { DataTable };

//# sourceMappingURL=DataTable.js.map