import { Dialog, Portal } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { isValidElement } from "react";
//#region src/components/overlays/dialog/ComposedDialog.tsx
function ComposedDialog({ hideBackdrop, backdropProps, contentProps, trigger, children, ref, ...rest }) {
	return /* @__PURE__ */ jsxs(Dialog.Root, {
		...rest,
		children: [isValidElement(trigger) && /* @__PURE__ */ jsx(Dialog.Trigger, {
			asChild: true,
			children: trigger
		}), /* @__PURE__ */ jsxs(Portal, { children: [!hideBackdrop && /* @__PURE__ */ jsx(Dialog.Backdrop, { ...backdropProps }), /* @__PURE__ */ jsx(Dialog.Positioner, { children: /* @__PURE__ */ jsx(Dialog.Content, {
			ref,
			...contentProps,
			children
		}) })] })]
	});
}
//#endregion
export { ComposedDialog };

//# sourceMappingURL=ComposedDialog.js.map