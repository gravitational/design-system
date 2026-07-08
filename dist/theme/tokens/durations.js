import { defineTokens } from "@chakra-ui/react";
//#region src/theme/tokens/durations.ts
const durations = defineTokens.durations({
	fastest: { value: "50ms" },
	faster: { value: "100ms" },
	fast: { value: "150ms" },
	moderate: { value: "200ms" },
	slow: { value: "300ms" },
	slower: { value: "400ms" },
	slowest: { value: "500ms" },
	dialog: { value: "225ms" }
});
//#endregion
export { durations };

//# sourceMappingURL=durations.js.map