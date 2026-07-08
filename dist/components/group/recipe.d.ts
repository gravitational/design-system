export declare const groupRecipe: import("@chakra-ui/react").RecipeDefinition<{
    orientation: {
        horizontal: {
            flexDirection: "row";
        };
        vertical: {
            flexDirection: "column";
        };
    };
    attached: {
        true: {
            gap: "0!";
        };
    };
    grow: {
        true: {
            display: "flex";
            '& > *': {
                flex: number;
            };
        };
    };
    stacking: {
        'first-on-top': {
            '& > [data-group-item]': {
                zIndex: "calc(var(--group-count) - var(--group-index))";
            };
        };
        'last-on-top': {
            '& > [data-group-item]': {
                zIndex: "var(--group-index)";
            };
        };
    };
}>;
