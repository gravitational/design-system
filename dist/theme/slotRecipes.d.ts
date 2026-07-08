export declare const slotRecipes: {
    alert: import("@chakra-ui/react").SlotRecipeDefinition<"content" | "title" | "description" | "root" | "indicator", {
        kind: {
            success: {
                root: {
                    borderColor: "interactive.solid.success.default";
                    bg: "interactive.tonal.success.0";
                };
                indicator: {
                    color: "text.primaryInverse";
                    bg: "interactive.solid.success.default";
                };
            };
            danger: {
                root: {
                    borderColor: "interactive.solid.danger.default";
                    bg: "interactive.tonal.danger.0";
                };
                indicator: {
                    color: "text.primaryInverse";
                    bg: "interactive.solid.danger.default";
                };
            };
            info: {
                root: {
                    borderColor: "interactive.solid.accent.default";
                    bg: "interactive.tonal.informational.0";
                };
                indicator: {
                    color: "text.primaryInverse";
                    bg: "interactive.solid.accent.default";
                };
            };
            warning: {
                root: {
                    borderColor: "interactive.solid.alert.default";
                    bg: "interactive.tonal.alert.0";
                };
                indicator: {
                    color: "text.primaryInverse";
                    bg: "interactive.solid.alert.default";
                };
            };
            neutral: {
                root: {
                    border: "sm";
                    borderColor: "text.disabled";
                    bg: "interactive.tonal.neutral.0";
                };
                indicator: {
                    color: "text.main";
                    bg: "interactive.tonal.neutral.0";
                };
            };
            cta: {
                root: {
                    border: "md";
                    borderColor: "interactive.solid.primary.default";
                    bg: "inherit";
                };
                indicator: {
                    color: "text.primaryInverse";
                    bg: "interactive.solid.primary.default";
                };
            };
        };
    }>;
    banner: import("@chakra-ui/react").SlotRecipeDefinition<"content" | "title" | "description" | "root" | "indicator", {
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
    blockquote: import("@chakra-ui/react").SlotRecipeDefinition<"content" | "caption" | "icon" | "root", {
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
    card: import("@chakra-ui/react").SlotRecipeDefinition<"body" | "footer" | "header" | "title" | "description" | "root", import("@chakra-ui/react").SlotRecipeVariantRecord<"body" | "footer" | "header" | "title" | "description" | "root">>;
    dialog: import("@chakra-ui/react").SlotRecipeDefinition<"content" | "body" | "footer" | "header" | "title" | "description" | "positioner" | "trigger" | "backdrop" | "closeTrigger", import("@chakra-ui/react").SlotRecipeVariantRecord<"content" | "body" | "footer" | "header" | "title" | "description" | "positioner" | "trigger" | "backdrop" | "closeTrigger">>;
    datePicker: import("@chakra-ui/react").SlotRecipeDefinition<"content" | "input" | "label" | "table" | "view" | "root" | "control" | "clearTrigger" | "monthSelect" | "nextTrigger" | "positioner" | "presetTrigger" | "prevTrigger" | "rangeText" | "tableBody" | "tableCell" | "tableCellTrigger" | "tableHead" | "tableHeader" | "tableRow" | "trigger" | "viewControl" | "viewTrigger" | "yearSelect" | "valueText", import("@chakra-ui/react").SlotRecipeVariantRecord<"content" | "input" | "label" | "table" | "view" | "root" | "control" | "clearTrigger" | "monthSelect" | "nextTrigger" | "positioner" | "presetTrigger" | "prevTrigger" | "rangeText" | "tableBody" | "tableCell" | "tableCellTrigger" | "tableHead" | "tableHeader" | "tableRow" | "trigger" | "viewControl" | "viewTrigger" | "yearSelect" | "valueText">>;
    list: import("@chakra-ui/react").SlotRecipeDefinition<"root" | "indicator" | "item", {
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
    menu: import("@chakra-ui/react").SlotRecipeDefinition<"content" | "separator" | "indicator" | "positioner" | "trigger" | "item" | "itemText" | "itemIndicator" | "arrow" | "arrowTip" | "contextTrigger" | "itemGroup" | "itemGroupLabel" | "triggerItem" | "itemCommand", {
        size: {
            sm: {
                item: {
                    gap: number;
                    textStyle: "body3";
                    py: number;
                    px: number;
                };
                triggerItem: {
                    gap: number;
                    textStyle: "body3";
                    py: number;
                    px: number;
                };
                itemGroupLabel: {
                    textStyle: "subtitle3";
                    px: number;
                    py: number;
                };
                itemCommand: {
                    fontSize: number;
                };
            };
            md: {
                item: {
                    gap: number;
                    textStyle: "body2";
                    py: number;
                    px: number;
                };
                triggerItem: {
                    gap: number;
                    textStyle: "body2";
                    py: number;
                    px: number;
                };
                itemGroupLabel: {
                    textStyle: "subtitle3";
                    px: number;
                    py: number;
                };
                itemCommand: {
                    fontSize: number;
                };
            };
        };
    }>;
    popover: import("@chakra-ui/react").SlotRecipeDefinition<"content" | "body" | "footer" | "header" | "title" | "anchor" | "description" | "indicator" | "positioner" | "trigger" | "closeTrigger" | "arrow" | "arrowTip", import("@chakra-ui/react").SlotRecipeVariantRecord<"content" | "body" | "footer" | "header" | "title" | "anchor" | "description" | "indicator" | "positioner" | "trigger" | "closeTrigger" | "arrow" | "arrowTip">>;
    checkbox: import("@chakra-ui/react").SlotRecipeDefinition<"label" | "group" | "root" | "indicator" | "control", {
        size: {
            sm: {
                control: {
                    width: "14px";
                    height: "14px";
                    _icon: {
                        width: "12px";
                        height: "12px";
                    };
                };
                label: {
                    textStyle: "body2";
                };
            };
            md: {
                control: {
                    width: "18px";
                    height: "18px";
                    _icon: {
                        width: "16px";
                        height: "16px";
                    };
                };
                label: {
                    textStyle: "body1";
                };
            };
        };
    }>;
    field: import("@chakra-ui/react").SlotRecipeDefinition<"input" | "label" | "select" | "textarea" | "root" | "errorText" | "helperText" | "requiredIndicator", {
        orientation: {
            vertical: {
                root: {
                    flexDirection: "column";
                    alignItems: "flex-start";
                };
            };
            horizontal: {
                root: {
                    flexDirection: "row";
                    alignItems: "center";
                    justifyContent: "space-between";
                };
                label: {
                    flex: "0 0 var(--field-label-width, 80px)";
                };
            };
        };
    }>;
    radioGroup: import("@chakra-ui/react").SlotRecipeDefinition<"label" | "root" | "indicator" | "item" | "itemText" | "itemControl" | "itemAddon" | "itemIndicator", {
        size: {
            sm: {
                itemControl: {
                    width: "14px";
                    height: "14px";
                    borderWidth: "1px";
                    '& .dot': {
                        scale: "0.57";
                    };
                };
                itemText: {
                    textStyle: "body2";
                };
            };
            md: {
                itemControl: {
                    width: "18px";
                    height: "18px";
                    borderWidth: "1.5px";
                    '& .dot': {
                        scale: "0.56";
                    };
                };
                itemText: {
                    textStyle: "body1";
                };
            };
        };
    }>;
    switch: import("@chakra-ui/react").SlotRecipeDefinition<"label" | "root" | "indicator" | "control" | "thumb", {
        size: {
            sm: {
                root: {
                    '--toggle-track-width': "32px";
                    '--toggle-track-height': "16px";
                    '--toggle-thumb-size': "12px";
                    '--toggle-thumb-offset': "2px";
                    '--toggle-thumb-translate': "18px";
                };
            };
            lg: {
                root: {
                    '--toggle-track-width': "40px";
                    '--toggle-track-height': "20px";
                    '--toggle-thumb-size': "14px";
                    '--toggle-thumb-offset': "3px";
                    '--toggle-thumb-translate': "23px";
                };
            };
        };
    }>;
    table: import("@chakra-ui/react").SlotRecipeDefinition<"body" | "caption" | "footer" | "header" | "cell" | "row" | "root" | "columnHeader", {
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
    tooltip: import("@chakra-ui/react").SlotRecipeDefinition<"content" | "positioner" | "trigger" | "arrow" | "arrowTip", import("@chakra-ui/react").SlotRecipeVariantRecord<"content" | "positioner" | "trigger" | "arrow" | "arrowTip">>;
};
