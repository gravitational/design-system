import { ArrowCircleLeftIcon } from "../../icons/generated/ArrowCircleLeftIcon.js";
import { ArrowCircleRightIcon } from "../../icons/generated/ArrowCircleRightIcon.js";
import "../../icons/index.js";
import { chakra } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/table/Pager.tsx
function Pager({ onPrev, onNext, isLoading, from, to, totalCount }) {
	const showRange = totalCount != null && totalCount > 0 && from != null && to != null;
	return /* @__PURE__ */ jsxs(chakra.div, {
		display: "flex",
		justifyContent: "flex-end",
		width: "100%",
		alignItems: "center",
		mb: 1,
		children: [showRange && /* @__PURE__ */ jsxs(chakra.span, {
			textStyle: "body3",
			marginInlineEnd: 2,
			whiteSpace: "nowrap",
			color: "text.main",
			children: [
				"Showing ",
				/* @__PURE__ */ jsx(chakra.strong, {
					fontWeight: "bold",
					children: from
				}),
				" -",
				" ",
				/* @__PURE__ */ jsx(chakra.strong, {
					fontWeight: "bold",
					children: to
				}),
				" of",
				" ",
				/* @__PURE__ */ jsx(chakra.strong, {
					fontWeight: "bold",
					children: totalCount
				})
			]
		}), /* @__PURE__ */ jsxs(chakra.div, {
			display: "flex",
			children: [/* @__PURE__ */ jsx(ArrowButton, {
				onClick: onPrev,
				title: "Previous page",
				disabled: !onPrev || isLoading,
				type: "button",
				children: /* @__PURE__ */ jsx(ArrowCircleLeftIcon, {})
			}), /* @__PURE__ */ jsx(ArrowButton, {
				onClick: onNext,
				title: "Next page",
				disabled: !onNext || isLoading,
				type: "button",
				children: /* @__PURE__ */ jsx(ArrowCircleRightIcon, {})
			})]
		})]
	});
}
const ArrowButton = chakra("button", { base: {
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	bg: "transparent",
	border: "none",
	color: "text.slightlyMuted",
	cursor: "pointer",
	p: 1,
	borderRadius: "sm",
	transitionProperty: "common",
	transitionDuration: "moderate",
	"& svg": { fontSize: 7 },
	_hover: {
		color: "text.main",
		bg: "interactive.tonal.neutral.0"
	},
	_disabled: {
		color: "text.disabled",
		cursor: "not-allowed",
		_hover: { bg: "transparent" }
	}
} });
//#endregion
export { Pager };

//# sourceMappingURL=Pager.js.map