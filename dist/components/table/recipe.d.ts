export declare const tableSlotRecipe: import("@chakra-ui/react").SlotRecipeDefinition<"body" | "caption" | "footer" | "header" | "cell" | "row" | "root" | "columnHeader", {
    size: {
        sm: {
            root: {
                textStyle: "sm";
            };
            columnHeader: {
                px: number;
                py: number;
            };
            cell: {
                px: number;
                py: number;
            };
        };
        md: {
            root: {
                textStyle: "sm";
            };
            columnHeader: {
                px: number;
                py: number;
            };
            cell: {
                px: number;
                py: number;
            };
        };
        lg: {
            root: {
                textStyle: "md";
            };
            columnHeader: {
                px: number;
                py: number;
            };
            cell: {
                px: number;
                py: number;
            };
        };
    };
    variant: {
        line: {
            columnHeader: {
                borderBottomWidth: "1px";
            };
            cell: {
                borderBottomWidth: "1px";
            };
        };
        outline: {
            root: {
                boxShadow: "0 0 0 1px {colors.interactive.tonal.neutral.1}";
            };
            columnHeader: {
                borderBottomWidth: "1px";
            };
            header: {
                bg: "interactive.tonal.neutral.0";
            };
            row: {
                '&:not(:last-of-type)': {
                    borderBottomWidth: "1px";
                };
            };
            footer: {
                borderTopWidth: "1px";
            };
        };
    };
}>;
