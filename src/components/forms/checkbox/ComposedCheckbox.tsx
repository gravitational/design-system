import {
  Checkbox as ChakraCheckbox,
  type SlotRecipeProps,
} from '@chakra-ui/react';
import type { ReactNode, RefAttributes } from 'react';

import { CheckBoldIcon } from '../../../icons';

export type CheckboxSize = SlotRecipeProps<'checkbox'>['size'];

export interface ComposedCheckboxProps extends ChakraCheckbox.RootProps {
  /** Label rendered next to the checkbox. */
  label?: ReactNode;
}

export function ComposedCheckbox({
  label,
  children,
  ...rest
}: ComposedCheckboxProps & RefAttributes<HTMLLabelElement>) {
  return (
    <ChakraCheckbox.Root {...rest}>
      <ChakraCheckbox.HiddenInput />
      <ChakraCheckbox.Control>
        <ChakraCheckbox.Indicator checked={<CheckBoldIcon />} />
      </ChakraCheckbox.Control>
      {(label ?? children) != null && (
        <ChakraCheckbox.Label>{label ?? children}</ChakraCheckbox.Label>
      )}
    </ChakraCheckbox.Root>
  );
}
