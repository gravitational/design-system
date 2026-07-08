import { CheckCircleIcon } from "../../../icons/generated/CheckCircleIcon.js";
import { InfoIcon } from "../../../icons/generated/InfoIcon.js";
import { WarningCircleIcon } from "../../../icons/generated/WarningCircleIcon.js";
import { WarningIcon } from "../../../icons/generated/WarningIcon.js";
import "../../../icons/index.js";
import { CloseButton } from "../../button/CloseButton.js";
import "../../button/index.js";
import { Banner } from "./banner.js";
import { Spinner } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/feedback/banner/ComposedBanner.tsx
const defaultIconByKind = {
	success: CheckCircleIcon,
	danger: WarningCircleIcon,
	warning: WarningIcon,
	info: InfoIcon,
	neutral: InfoIcon
};
/**
* Displays a banner at the top of the page.
*/
function ComposedBanner({ kind, title, description, icon: Icon, isLoading, isClosable, onClose, children, ref, ...rest }) {
	const kindKey = kind ?? "danger";
	const IconForKind = Icon ?? (kindKey === "primary" ? void 0 : defaultIconByKind[kindKey]);
	return /* @__PURE__ */ jsxs(Banner.Root, {
		ref,
		kind,
		...rest,
		children: [
			isLoading ? /* @__PURE__ */ jsx(Banner.Indicator, { children: /* @__PURE__ */ jsx(Spinner, { size: "sm" }) }) : IconForKind ? /* @__PURE__ */ jsx(Banner.Indicator, { children: /* @__PURE__ */ jsx(IconForKind, {}) }) : null,
			/* @__PURE__ */ jsxs(Banner.Content, { children: [
				title && /* @__PURE__ */ jsx(Banner.Title, { children: title }),
				description && /* @__PURE__ */ jsx(Banner.Description, { children: description }),
				children
			] }),
			isClosable && /* @__PURE__ */ jsx(CloseButton, { onClick: onClose })
		]
	});
}
//#endregion
export { ComposedBanner };

//# sourceMappingURL=ComposedBanner.js.map