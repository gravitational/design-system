export declare const buttonRecipe: import("@chakra-ui/react").RecipeDefinition<{
    /**
     * The size of the button.
     */
    size: {
        sm: {
            px: "calc({spacing.2} - 1.5px)";
            gap: number;
            minH: "{sizes.6}";
            minW: "{sizes.6}";
            fontSize: number;
            lineHeight: "{sizes.4}";
            _icon: {
                width: "4";
                height: "4";
            };
        };
        md: {
            minH: "{sizes.8}";
            minW: "{sizes.8}";
            fontSize: number;
            lineHeight: "{sizes.4}";
            _icon: {
                width: "4";
                height: "4";
            };
        };
        lg: {
            minH: "{sizes.10}";
            minW: "{sizes.10}";
            fontSize: number;
            lineHeight: "{sizes.5}";
            letterSpacing: "0.175px";
            _icon: {
                width: "5";
                height: "5";
            };
        };
        xl: {
            minH: "{sizes.11}";
            minW: "{sizes.11}";
            fontSize: number;
            lineHeight: "{sizes.6}";
            letterSpacing: "0.2px";
            gap: number;
            _icon: {
                width: "6";
                height: "6";
            };
        };
    };
    /**
     * Fill specifies the desired shape of the button.
     */
    fill: {
        filled: {};
        minimal: {};
        border: {};
        link: {
            bg: "none";
            color: "buttons.link.default";
            fontWeight: "normal";
            textDecoration: "underline";
            textTransform: "none";
            px: "2";
            _hover: {
                bg: "levels.surface";
                color: "buttons.link.hover";
                boxShadow: "none";
            };
            _active: {
                bg: "levels.surface";
                color: "buttons.link.active";
            };
            _focusVisible: {
                borderColor: "buttons.link.default";
                boxShadow: "none";
                bg: "levels.surface";
                color: "buttons.link.hover";
            };
        };
    };
    /**
     * Specifies the button's purpose class and affects its color palette.
     */
    intent: {
        neutral: {};
        primary: {};
        danger: {};
        success: {};
    };
    /**
     * If `true`, the button will take the full width of its container.
     */
    block: {
        true: {
            w: "100%";
        };
    };
    /**
     * Reduces the horizontal padding to make the button more compact.
     */
    compact: {
        true: {
            px: "calc({spacing.1} - 1.5px)";
        };
    };
    /**
     * If `true`, the button will have adjusted padding to align with input fields.
     */
    inputAlignment: {
        true: {
            px: "calc({spacing.4} - 1.5px)";
        };
    };
}>;
