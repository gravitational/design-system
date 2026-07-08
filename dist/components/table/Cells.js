import { CaretDownIcon } from "../../icons/generated/CaretDownIcon.js";
import { CaretUpDownIcon } from "../../icons/generated/CaretUpDownIcon.js";
import { CaretUpIcon } from "../../icons/generated/CaretUpIcon.js";
import "../../icons/index.js";
import { Label } from "../label/Label.js";
import "../label/index.js";
import { chakra } from "@chakra-ui/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/table/Cells.tsx
function TextCell({ data }) {
	return /* @__PURE__ */ jsx(Fragment, { children: data ?? "" });
}
function LabelCell({ data = [] }) {
	return /* @__PURE__ */ jsx(chakra.div, {
		display: "flex",
		flexWrap: "wrap",
		gap: 1,
		children: data.map((label, index) => /* @__PURE__ */ jsx(Label, {
			kind: "secondary",
			children: label
		}, `${label}${index}`))
	});
}
function ClickableLabelCell({ labels, onClick }) {
	return /* @__PURE__ */ jsx(chakra.div, {
		display: "flex",
		flexWrap: "wrap",
		gap: 1,
		children: labels.map((label, index) => /* @__PURE__ */ jsx(chakra.button, {
			type: "button",
			bg: "transparent",
			border: "none",
			p: 0,
			cursor: "pointer",
			onClick: (e) => {
				e.stopPropagation();
				onClick(label);
			},
			children: /* @__PURE__ */ jsx(Label, {
				kind: "secondary",
				_hover: { bg: "interactive.tonal.neutral.1" },
				children: `${label.name}: ${label.value}`
			})
		}, `${label.name}${label.value}${index}`))
	});
}
/**
* Renders a column header with a sort indicator.
*/
function SortableHeader({ header, children }) {
	const canSort = header.column.getCanSort();
	const sorted = header.column.getIsSorted();
	if (!canSort) return /* @__PURE__ */ jsx(Fragment, { children });
	return /* @__PURE__ */ jsxs(chakra.button, {
		type: "button",
		onClick: header.column.getToggleSortingHandler(),
		display: "flex",
		alignItems: "center",
		gap: 1,
		bg: "transparent",
		border: "none",
		color: "inherit",
		cursor: "pointer",
		font: "inherit",
		p: 0,
		children: [children, /* @__PURE__ */ jsx(SortIndicator, {
			sorted,
			"aria-hidden": true
		})]
	});
}
function SortIndicator({ sorted, ...rest }) {
	if (sorted === "desc") return /* @__PURE__ */ jsx(CaretDownIcon, { ...rest });
	if (sorted === "asc") return /* @__PURE__ */ jsx(CaretUpIcon, { ...rest });
	return /* @__PURE__ */ jsx(CaretUpDownIcon, { ...rest });
}
//#endregion
export { ClickableLabelCell, LabelCell, SortableHeader, TextCell };

//# sourceMappingURL=Cells.js.map