import { Portal, Tooltip } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
import "react";
//#region src/components/overlays/tooltip/Tooltip.tsx
function Tooltip$1({ showArrow = true, children, disabled, portalled = true, content, contentProps, portalRef, placement, gutter, positioning, ref, ...rest }) {
	if (disabled || !content) return children;
	const mergedPositioning = mergePositioning(placement, gutter, positioning);
	return /* @__PURE__ */ jsxs(Tooltip.Root, {
		positioning: mergedPositioning,
		...rest,
		children: [/* @__PURE__ */ jsx(Tooltip.Trigger, {
			asChild: true,
			children
		}), /* @__PURE__ */ jsx(Portal, {
			disabled: !portalled,
			container: portalRef,
			children: /* @__PURE__ */ jsx(Tooltip.Positioner, { children: /* @__PURE__ */ jsxs(Tooltip.Content, {
				ref,
				...contentProps,
				children: [showArrow && /* @__PURE__ */ jsx(Tooltip.Arrow, { children: /* @__PURE__ */ jsx(Tooltip.ArrowTip, {}) }), content]
			}) })
		})]
	});
}
function mergePositioning(placement, gutter, positioning) {
	if (placement === void 0 && gutter === void 0 && !positioning) return;
	return {
		...placement !== void 0 && { placement },
		...gutter !== void 0 && { gutter },
		...positioning
	};
}
//#endregion
export { Tooltip$1 as Tooltip };

//# sourceMappingURL=Tooltip.js.map