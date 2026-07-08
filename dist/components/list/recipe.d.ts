export declare const listSlotRecipe: import("@chakra-ui/react").SlotRecipeDefinition<"root" | "indicator" | "item", {
    variant: {
        marker: {
            root: {
                listStyle: "revert";
            };
            item: {
                _marker: {
                    color: "fg.subtle";
                };
            };
        };
        plain: {
            item: {
                alignItems: "flex-start";
                display: "inline-flex";
            };
        };
    };
    align: {
        center: {
            item: {
                alignItems: "center";
            };
        };
        start: {
            item: {
                alignItems: "flex-start";
            };
        };
        end: {
            item: {
                alignItems: "flex-end";
            };
        };
    };
}>;
