export declare const recipes: {
    button: import("@chakra-ui/react").RecipeDefinition<{
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
        intent: {
            neutral: {};
            primary: {};
            danger: {};
            success: {};
        };
        block: {
            true: {
                w: "100%";
            };
        };
        compact: {
            true: {
                px: "calc({spacing.1} - 1.5px)";
            };
        };
        inputAlignment: {
            true: {
                px: "calc({spacing.4} - 1.5px)";
            };
        };
    }>;
    code: import("@chakra-ui/react").RecipeDefinition<{
        variant: {
            subtle: {
                bg: "interactive.tonal.neutral.0";
            };
            outline: {
                bg: "interactive.tonal.neutral.0";
                color: "text.main";
                shadow: "inset 0 0 0px 1px var(--shadow-color)";
                shadowColor: "interactive.tonal.neutral.1";
            };
        };
        size: {
            xs: {
                textStyle: "2xs";
                px: "1";
                minH: "4";
            };
            sm: {
                fontSize: "sm";
                lineHeight: "16px";
                px: "1";
                minH: "5";
            };
            md: {
                textStyle: "sm";
                px: "2";
                minH: "6";
            };
            lg: {
                textStyle: "sm";
                px: "2.5";
                minH: "7";
            };
        };
    }>;
    container: import("@chakra-ui/react").RecipeDefinition<{
        centerContent: {
            true: {
                display: "flex";
                flexDirection: "column";
                alignItems: "center";
            };
        };
        fluid: {
            true: {
                maxWidth: "full";
            };
        };
    }>;
    group: import("@chakra-ui/react").RecipeDefinition<{
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
    heading: import("@chakra-ui/react").RecipeDefinition<{
        size: {
            xs: {
                textStyle: "h4";
            };
            sm: {
                textStyle: "h3";
            };
            md: {
                textStyle: "h2";
            };
            lg: {
                textStyle: "h1";
            };
        };
    }>;
    icon: import("@chakra-ui/react").RecipeDefinition<{
        size: {
            inherit: {};
            xs: {
                boxSize: "3";
            };
            sm: {
                boxSize: "4";
            };
            md: {
                boxSize: "5";
            };
            lg: {
                boxSize: "6";
            };
            xl: {
                boxSize: "7";
            };
            '2xl': {
                boxSize: "8";
            };
        };
    }>;
    iconButton: import("@chakra-ui/react").RecipeDefinition<{
        size: {
            sm: {
                width: "24px";
                height: "24px";
                fontSize: "12px";
            };
            md: {
                width: "32px";
                height: "32px";
                fontSize: "16px";
            };
            lg: {
                width: "48px";
                height: "48px";
                fontSize: "24px";
            };
        };
        shape: {
            circle: {
                borderRadius: "full";
            };
            square: {
                borderRadius: "sm";
            };
        };
    }>;
    input: import("@chakra-ui/react").RecipeDefinition<{
        size: {
            sm: {
                textStyle: "body3";
                '--input-height': "sizes.8";
                _hasIcon: {
                    paddingInlineStart: "40px";
                };
                _invalid: {
                    paddingInlineEnd: "32px";
                };
            };
            md: {
                textStyle: "body2";
                '--input-height': "sizes.10";
                _hasIcon: {
                    paddingInlineStart: "42px";
                };
                _invalid: {
                    paddingInlineEnd: "34px";
                };
            };
            lg: {
                textStyle: "body1";
                '--input-height': "sizes.12";
                _hasIcon: {
                    paddingInlineStart: "48px";
                };
                _invalid: {
                    paddingInlineEnd: "40px";
                };
            };
        };
    }>;
    link: import("@chakra-ui/react").RecipeDefinition<{
        variant: {
            underline: {
                textDecoration: "underline";
                textUnderlineOffset: "3px";
                textDecorationColor: "currentColor/20";
            };
            plain: {
                _hover: {
                    textDecoration: "underline";
                };
            };
        };
    }>;
    shimmerBox: import("@chakra-ui/react").RecipeDefinition<import("@chakra-ui/react").RecipeVariantRecord>;
    spinner: import("@chakra-ui/react").RecipeDefinition<{
        size: {
            inherit: {
                '--spinner-size': "1em";
            };
            xs: {
                '--spinner-size': "sizes.3";
            };
            sm: {
                '--spinner-size': "sizes.4";
            };
            md: {
                '--spinner-size': "sizes.5";
            };
            lg: {
                '--spinner-size': "sizes.8";
            };
            xl: {
                '--spinner-size': "sizes.10";
            };
        };
    }>;
};
