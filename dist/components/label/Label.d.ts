export type LabelKind = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export declare const Label: import("@chakra-ui/react").ChakraComponent<"div", {
    kind?: import("@chakra-ui/react").ConditionalValue<"primary" | "danger" | "success" | "warning" | "secondary" | undefined>;
}>;
export type LabelProps = React.ComponentProps<typeof Label>;
