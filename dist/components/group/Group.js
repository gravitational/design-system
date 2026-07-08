import { dataAttr } from "../../utils/attr.js";
import { chakra, useRecipe } from "@chakra-ui/react";
import { jsx } from "react/jsx-runtime";
import { Children, cloneElement, isValidElement, useMemo } from "react";
//#region src/components/group/Group.tsx
function Group(props) {
	const recipe = useRecipe({ key: "group" });
	const [variantProps, otherProps] = recipe.splitVariantProps(props);
	const styles = recipe(variantProps);
	const { align = "center", justify = "flex-start", children, wrap, skip, ref, ...rest } = otherProps;
	const _children = useMemo(() => {
		const childArray = Children.toArray(children).filter(isValidElement);
		if (childArray.length === 1) return childArray;
		const validChildArray = childArray.filter((child) => !skip?.(child));
		const validChildCount = validChildArray.length;
		if (validChildCount === 1) return childArray;
		return childArray.map((child) => {
			const childProps = child.props;
			if (skip?.(child)) return child;
			const index = validChildArray.indexOf(child);
			return cloneElement(child, {
				...childProps,
				"data-group-item": "",
				"data-first": dataAttr(index === 0),
				"data-last": dataAttr(index === validChildCount - 1),
				"data-between": dataAttr(index > 0 && index < validChildCount - 1),
				style: {
					"--group-count": validChildCount,
					"--group-index": index,
					...childProps?.style ?? {}
				}
			});
		});
	}, [children, skip]);
	return /* @__PURE__ */ jsx(chakra.div, {
		css: styles,
		ref,
		alignItems: align,
		justifyContent: justify,
		flexWrap: wrap,
		...rest,
		children: _children
	});
}
//#endregion
export { Group };

//# sourceMappingURL=Group.js.map