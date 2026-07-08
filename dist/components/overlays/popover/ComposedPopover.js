import { Popover, Portal } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { isValidElement } from "react";
//#region src/components/overlays/popover/ComposedPopover.tsx
function ComposedPopover({ placement, gutter, positioning, showArrow = true, portalled = true, portalRef, anchorRef, trigger, contentProps, children, ref, ...rest }) {
	const mergedPositioning = mergePositioning(placement, gutter, anchorRef, positioning);
	return /* @__PURE__ */ jsxs(Popover.Root, {
		positioning: mergedPositioning,
		portalled,
		...rest,
		children: [anchorRef === void 0 && isValidElement(trigger) && /* @__PURE__ */ jsx(Popover.Trigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ jsx(Portal, {
			disabled: !portalled,
			container: portalRef,
			children: /* @__PURE__ */ jsx(Popover.Positioner, { children: /* @__PURE__ */ jsxs(Popover.Content, {
				ref,
				...contentProps,
				children: [showArrow && /* @__PURE__ */ jsx(Popover.Arrow, { children: /* @__PURE__ */ jsx(Popover.ArrowTip, {}) }), children]
			}) })
		})]
	});
}
function mergePositioning(placement, gutter, anchorRef, positioning) {
	return {
		...placement !== void 0 && { placement },
		...gutter !== void 0 && { gutter },
		...anchorRef && { getAnchorElement: () => anchorRef.current },
		...positioning
	};
}
//#endregion
export { ComposedPopover };

//# sourceMappingURL=ComposedPopover.js.map