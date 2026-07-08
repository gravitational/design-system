import { chakra } from "@chakra-ui/react";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
//#region src/components/table/InputSearch.tsx
function InputSearch({ searchValue, setSearchValue, children, inputSize = "small", autoFocus = false, placeholder = "Search...", isDisabled = false }) {
	const [inputValue, setInputValue] = useState(searchValue);
	useEffect(() => {
		setInputValue(searchValue);
	}, [searchValue]);
	const big = inputSize === "big" ? "" : void 0;
	return /* @__PURE__ */ jsx(Wrapper, {
		"data-big": big,
		children: /* @__PURE__ */ jsxs(Form, {
			onSubmit: (e) => {
				e.preventDefault();
				setSearchValue(inputValue);
			},
			children: [
				/* @__PURE__ */ jsx(StyledInput, {
					"data-big": big,
					placeholder,
					value: inputValue,
					onChange: (e) => {
						setInputValue(e.currentTarget.value);
					},
					autoFocus,
					disabled: isDisabled
				}),
				/* @__PURE__ */ jsx(ChildWrapperBackground, { children: /* @__PURE__ */ jsx(ChildWrapper, { children }) }),
				/* @__PURE__ */ jsx("input", {
					type: "submit",
					style: { display: "none" }
				})
			]
		})
	});
}
const Wrapper = chakra("div", { base: {
	borderRadius: "full",
	width: "100%",
	height: 10,
	"&[data-big]": { height: 12 }
} });
const Form = chakra("form", { base: {
	position: "relative",
	display: "flex",
	overflow: "hidden",
	borderRadius: "full",
	height: "100%",
	background: "transparent",
	maxWidth: "725px"
} });
const StyledInput = chakra("input", { base: {
	border: "none",
	outline: "none",
	boxSizing: "border-box",
	width: "100%",
	transitionProperty: "common",
	transitionDuration: "moderate",
	color: "text.main",
	bg: "interactive.tonal.neutral.0",
	paddingInlineEnd: "184px",
	paddingInlineStart: 5,
	fontSize: 2,
	"&[data-big]": { fontSize: 3 }
} });
const ChildWrapperBackground = chakra("div", { base: {
	position: "absolute",
	height: "100%",
	right: 0,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderInlineStart: "1px solid",
	borderInlineStartColor: "interactive.tonal.neutral.0",
	borderInlineEndRadius: "full"
} });
const ChildWrapper = chakra("div", { base: {
	position: "relative",
	height: "100%",
	right: 0,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderInlineEndRadius: "full"
} });
//#endregion
export { InputSearch };

//# sourceMappingURL=InputSearch.js.map