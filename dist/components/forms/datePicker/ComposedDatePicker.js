import { CaretLeftIcon } from "../../../icons/generated/CaretLeftIcon.js";
import { CaretRightIcon } from "../../../icons/generated/CaretRightIcon.js";
import "../../../icons/index.js";
import { DatePickerContent, DatePickerNextTrigger, DatePickerPrevTrigger, DatePickerRangeText, DatePickerRoot, DatePickerTable, DatePickerTableBody, DatePickerTableCell, DatePickerTableCellTrigger, DatePickerTableHead, DatePickerTableHeader, DatePickerTableRow, DatePickerView, DatePickerViewControl, DatePickerViewTrigger, useDatePickerContext } from "./datePicker.js";
import "./namespace.js";
import { Flex } from "@chakra-ui/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
//#region src/components/forms/datePicker/ComposedDatePicker.tsx
function ViewNavigation() {
	return /* @__PURE__ */ jsxs(DatePickerViewControl, { children: [
		/* @__PURE__ */ jsx(DatePickerPrevTrigger, { children: /* @__PURE__ */ jsx(CaretLeftIcon, {}) }),
		/* @__PURE__ */ jsx(DatePickerViewTrigger, { children: /* @__PURE__ */ jsx(DatePickerRangeText, {}) }),
		/* @__PURE__ */ jsx(DatePickerNextTrigger, { children: /* @__PURE__ */ jsx(CaretRightIcon, {}) })
	] });
}
function DayTable({ offset = 0 }) {
	const api = useDatePickerContext();
	const offsetData = useMemo(() => offset ? api.getOffset({ months: offset }) : void 0, [api, offset]);
	const weeks = offsetData?.weeks ?? api.weeks;
	return /* @__PURE__ */ jsxs(DatePickerTable, { children: [/* @__PURE__ */ jsx(DatePickerTableHead, { children: /* @__PURE__ */ jsx(DatePickerTableRow, { children: api.weekDays.map((weekDay, i) => /* @__PURE__ */ jsx(DatePickerTableHeader, { children: weekDay.narrow }, i)) }) }), /* @__PURE__ */ jsx(DatePickerTableBody, { children: weeks.map((week, i) => /* @__PURE__ */ jsx(DatePickerTableRow, { children: week.map((day, j) => /* @__PURE__ */ jsx(DatePickerTableCell, {
		value: day,
		visibleRange: offsetData?.visibleRange,
		children: /* @__PURE__ */ jsx(DatePickerTableCellTrigger, { children: day.day })
	}, j)) }, i)) })] });
}
function GridTable({ view }) {
	const api = useDatePickerContext();
	return /* @__PURE__ */ jsx(DatePickerTable, { children: /* @__PURE__ */ jsx(DatePickerTableBody, { children: useMemo(() => view === "month" ? api.getMonthsGrid({
		columns: 4,
		format: "short"
	}) : api.getYearsGrid({ columns: 4 }), [api, view]).map((row, i) => /* @__PURE__ */ jsx(DatePickerTableRow, { children: row.map((cell, j) => /* @__PURE__ */ jsx(DatePickerTableCell, {
		value: cell.value,
		children: /* @__PURE__ */ jsx(DatePickerTableCellTrigger, { children: cell.label })
	}, j)) }, i)) }) });
}
function CalendarViews({ numOfMonths = 1 }) {
	const offsets = useMemo(() => Array.from({ length: numOfMonths }, (_, i) => i), [numOfMonths]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs(DatePickerView, {
			view: "day",
			children: [/* @__PURE__ */ jsx(ViewNavigation, {}), /* @__PURE__ */ jsx(Flex, {
				gap: "4",
				children: offsets.map((i) => /* @__PURE__ */ jsx(DayTable, { offset: i }, i))
			})]
		}),
		/* @__PURE__ */ jsxs(DatePickerView, {
			view: "month",
			children: [/* @__PURE__ */ jsx(ViewNavigation, {}), /* @__PURE__ */ jsx(GridTable, { view: "month" })]
		}),
		/* @__PURE__ */ jsxs(DatePickerView, {
			view: "year",
			children: [/* @__PURE__ */ jsx(ViewNavigation, {}), /* @__PURE__ */ jsx(GridTable, { view: "year" })]
		})
	] });
}
/**
* A calendar date picker for selecting date(s).
*/
function ComposedDatePicker({ children, ref, ...props }) {
	return /* @__PURE__ */ jsx(DatePickerRoot, {
		ref,
		...props,
		inline: true,
		fixedWeeks: true,
		children: children ?? /* @__PURE__ */ jsx(DatePickerContent, { children: /* @__PURE__ */ jsx(CalendarViews, { numOfMonths: props.numOfMonths }) })
	});
}
//#endregion
export { ComposedDatePicker };

//# sourceMappingURL=ComposedDatePicker.js.map