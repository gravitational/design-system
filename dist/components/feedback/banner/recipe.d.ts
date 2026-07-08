export declare const bannerSlotRecipe: import("@chakra-ui/react").SlotRecipeDefinition<"content" | "title" | "description" | "root" | "indicator", {
    /**
     * The kind of the banner.
     */
    kind: {
        primary: {
            root: {
                bg: "interactive.tonal.primary.2";
                borderColor: "interactive.solid.primary.default";
            };
            indicator: {
                color: "text.main";
            };
        };
        neutral: {
            root: {
                bg: "levels.elevated";
                borderColor: "text.main";
            };
            indicator: {
                color: "text.main";
            };
        };
        danger: {
            root: {
                bg: "interactive.tonal.danger.2";
                borderColor: "interactive.solid.danger.default";
            };
            indicator: {
                color: "interactive.solid.danger.default";
            };
        };
        warning: {
            root: {
                bg: "interactive.tonal.alert.2";
                borderColor: "interactive.solid.alert.default";
            };
            indicator: {
                color: "interactive.solid.alert.default";
            };
        };
        info: {
            root: {
                bg: "interactive.tonal.informational.2";
                borderColor: "interactive.solid.accent.default";
            };
            indicator: {
                color: "interactive.solid.accent.default";
            };
        };
        success: {
            root: {
                bg: "interactive.tonal.success.2";
                borderColor: "interactive.solid.success.default";
            };
            indicator: {
                color: "interactive.solid.success.default";
            };
        };
    };
}>;
