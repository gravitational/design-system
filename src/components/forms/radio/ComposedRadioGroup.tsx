import {
  RadioGroup as ChakraRadioGroup,
  type SlotRecipeProps,
} from '@chakra-ui/react';
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

export function ComposedRadioGroup({
  label,
  options,
  children,
  ...rest
}: ComposedRadioGroupProps & RefAttributes<HTMLDivElement>) {
  return (
    <ChakraRadioGroup.Root {...rest}>
      {label && <ChakraRadioGroup.Label>{label}</ChakraRadioGroup.Label>}
      {options?.map(option => (
        <ChakraRadioGroup.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          <ChakraRadioGroup.ItemHiddenInput />
          <ChakraRadioGroup.ItemIndicator />
          {option.label != null && (
            <ChakraRadioGroup.ItemText>
              {option.label}
            </ChakraRadioGroup.ItemText>
          )}
        </ChakraRadioGroup.Item>
      ))}
      {children}
    </ChakraRadioGroup.Root>
  );
}
