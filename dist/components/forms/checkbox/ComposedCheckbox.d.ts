import { Checkbox as ChakraCheckbox, type SlotRecipeProps } from '@chakra-ui/react';
import type { ReactNode, RefAttributes } from 'react';
export type CheckboxSize = SlotRecipeProps<'checkbox'>['size'];
export interface ComposedCheckboxProps extends ChakraCheckbox.RootProps {
    /** Label rendered next to the checkbox. */
    label?: ReactNode;
}
export declare function ComposedCheckbox({ label, children, ...rest }: ComposedCheckboxProps & RefAttributes<HTMLLabelElement>): import("react/jsx-runtime").JSX.Element;
