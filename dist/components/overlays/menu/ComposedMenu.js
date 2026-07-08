import { Menu, Portal } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { isValidElement } from "react";
//#region src/components/overlays/menu/ComposedMenu.tsx
/**
* Displays a list of actions or options anchored to a trigger element.
* Supports nested submenus, keyboard navigation, checkbox/radio items, and hover-to-open.
*/
function ComposedMenu({ placement = "bottom-start", gutter, positioning, portalled = true, portalRef, trigger, contentProps, children, defaultOpen, open: openProp, onOpenChange: onOpenChangeProp, ref, ...rest }) {
	const mergedPositioning = mergePositioning(placement, gutter, positioning);
	const rootProps = mergeRootProps({
		openProp,
		defaultOpen,
		onOpenChangeProp
	});
	return /* @__PURE__ */ jsxs(Menu.Root, {
		positioning: mergedPositioning,
		...rootProps,
		...rest,
		children: [isValidElement(trigger) && /* @__PURE__ */ jsx(Menu.Trigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ jsx(Portal, {
			disabled: !portalled,
			container: portalRef,
			children: /* @__PURE__ */ jsx(Menu.Positioner, { children: /* @__PURE__ */ jsx(Menu.Content, {
				ref,
				...contentProps,
				children
			}) })
		})]
	});
}
const mergeRootProps = ({ defaultOpen, openProp: open, onOpenChangeProp: onOpenChange }) => ({
	...defaultOpen !== void 0 && { defaultOpen },
	...open !== void 0 && { open },
	...onOpenChange !== void 0 && { onOpenChange }
});
const mergePositioning = (placement, gutter, positioning) => ({
	...placement !== void 0 && { placement },
	...gutter !== void 0 && { gutter },
	...positioning
});
//#endregion
export { ComposedMenu };

//# sourceMappingURL=ComposedMenu.js.map