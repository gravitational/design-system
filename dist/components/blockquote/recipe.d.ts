export declare const blockquoteSlotRecipe: import("@chakra-ui/react").SlotRecipeDefinition<"content" | "caption" | "icon" | "root", {
    justify: {
        start: {
            root: {
                alignItems: "flex-start";
                textAlign: "start";
            };
        };
        center: {
            root: {
                alignItems: "center";
                textAlign: "center";
            };
        };
        end: {
            root: {
                alignItems: "flex-end";
                textAlign: "end";
            };
        };
    };
    variant: {
        subtle: {
            root: {
                color: "text.slightlyMuted";
                paddingX: "5";
                borderStartWidth: "4px";
                borderStartColor: "interactive.tonal.neutral.2";
            };
            icon: {
                color: "colorPalette.fg";
            };
        };
    };
}>;
