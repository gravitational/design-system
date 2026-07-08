import { compact } from "../../../utils/compact.js";
import { mapObject } from "../../../utils/walkObject.js";
import { chakra } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
import { useMemo } from "react";
//#region src/components/layout/grid/GridItem.tsx
function GridItem(props) {
	const { area, colSpan, colStart, colEnd, rowEnd, rowSpan, rowStart, ref, ...rest } = props;
	const styles = useMemo(() => compact({
		gridArea: area,
		gridColumn: spanFn(colSpan),
		gridRow: spanFn(rowSpan),
		gridColumnStart: colStart,
		gridColumnEnd: colEnd,
		gridRowStart: rowStart,
		gridRowEnd: rowEnd
	}), [
		area,
		colSpan,
		colStart,
		colEnd,
		rowEnd,
		rowSpan,
		rowStart
	]);
	return /* @__PURE__ */ jsx(chakra.div, {
		ref,
		css: [styles, props.css],
		...rest
	});
}
function spanFn(span) {
	return mapObject(span, (value) => value === "auto" ? "auto" : `span ${value}/span ${value}`);
}
//#endregion
export { GridItem };

//# sourceMappingURL=GridItem.js.map