import { RadioGroup as ChakraRadioGroup, type SlotRecipeProps } from '@chakra-ui/react';
import type { ReactNode, RefAttributes } from 'react';
export type RadioGroupSize = SlotRecipeProps<'radioGroup'>['size'];
export interface RadioOption {
    value: string;
    label?: ReactNode;
    disabled?: boolean;
}
export interface ComposedRadioGroupProps extends ChakraRadioGroup.RootProps {
    /** Label rendered above the radio group. */
    label?: ReactNode;
    /** Radio options to render. */
    options?: RadioOption[];
}
export declare function ComposedRadioGroup({ label, options, children, ...rest }: ComposedRadioGroupProps & RefAttributes<HTMLDivElement>): import("react/jsx-runtime").JSX.Element;
