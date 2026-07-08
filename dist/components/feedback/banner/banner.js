import { createSlotRecipeContext } from "@chakra-ui/react";
//#region src/components/feedback/banner/banner.ts
const { withProvider, withContext } = createSlotRecipeContext({ key: "banner" });
const Banner = {
	Root: withProvider("div", "root"),
	Content: withContext("div", "content"),
	Title: withContext("div", "title"),
	Description: withContext("div", "description"),
	Indicator: withContext("div", "indicator")
};
//#endregion
export { Banner };

//# sourceMappingURL=banner.js.map