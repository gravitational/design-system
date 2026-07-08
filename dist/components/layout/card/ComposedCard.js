import { Card } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/layout/card/ComposedCard.tsx
function ComposedCard({ title, footer, children, ref, ...rest }) {
	return /* @__PURE__ */ jsxs(Card.Root, {
		ref,
		...rest,
		children: [
			title && /* @__PURE__ */ jsx(Card.Header, {
				px: 5,
				pt: 5,
				children: /* @__PURE__ */ jsx(Card.Title, { children: title })
			}),
			/* @__PURE__ */ jsx(Card.Body, {
				p: 5,
				children
			}),
			footer && /* @__PURE__ */ jsx(Card.Footer, {
				px: 5,
				pb: 5,
				gap: 2,
				children: footer
			})
		]
	});
}
//#endregion
export { ComposedCard };

//# sourceMappingURL=ComposedCard.js.map