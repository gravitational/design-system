import { Field as ChakraField } from '@chakra-ui/react';
import type { ReactNode, RefAttributes } from 'react';

export interface ComposedFieldProps extends ChakraField.RootProps {
  /** Label rendered above the field. */
  label?: ReactNode;
  /** Helper text rendered below the field. */
  helperText?: ReactNode;
  /** Error message rendered below the field when invalid. */
  errorMessage?: ReactNode;
}

export function ComposedField({
  label,
  helperText,
  errorMessage,
  required,
  children,
  ...rest
}: ComposedFieldProps & RefAttributes<HTMLDivElement>) {
  return (
    <ChakraField.Root required={required} {...rest}>
      {label && (
        <ChakraField.Label>
          {label}
          {required && <ChakraField.RequiredIndicator />}
        </ChakraField.Label>
      )}
      {children}
      {errorMessage && (
        <ChakraField.ErrorText>{errorMessage}</ChakraField.ErrorText>
      )}
      {helperText && !errorMessage && (
        <ChakraField.HelperText>{helperText}</ChakraField.HelperText>
      )}
    </ChakraField.Root>
  );
}
