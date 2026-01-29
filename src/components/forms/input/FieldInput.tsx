import { mergeRefs } from '@chakra-ui/react';
import type { ReactNode, RefAttributes } from 'react';
import {
  useController,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { Field } from '../field';
import type { StringFieldPath } from '../types';
import { Input, type InputProps } from './Input';

export interface FieldInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends StringFieldPath<TFieldValues> = StringFieldPath<TFieldValues>,
> extends InputProps {
  label?: ReactNode;
  name: TName;
  helperText?: ReactNode;
  required?: boolean;
}

export function FieldInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends StringFieldPath<TFieldValues> = StringFieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  helperText,
  name,
  label,
  required,
  ...rest
}: FieldInputProps<TFieldValues, TName> & RefAttributes<HTMLInputElement>) {
  const {
    field,
    fieldState,
    formState: { isSubmitting },
  } = useController<
    TFieldValues,
    TName & FieldPath<TFieldValues>,
    TTransformedValues
  >({
    name,
  });

  const mergedRef = mergeRefs<HTMLInputElement>(rest.ref, field.ref);

  return (
    <Field.Root invalid={fieldState.invalid} required={required}>
      {label && (
        <Field.Label>
          {label} {required && <Field.RequiredIndicator />}
        </Field.Label>
      )}

      <Input
        disabled={isSubmitting}
        {...rest}
        {...field}
        ref={mergedRef}
        value={field.value ?? ''}
      />

      <Field.ErrorText>{fieldState.error?.message}</Field.ErrorText>

      {helperText && !fieldState.error && (
        <Field.HelperText>{helperText}</Field.HelperText>
      )}
    </Field.Root>
  );
}

export function FieldInputPassword<
  TFieldValues extends FieldValues = FieldValues,
  TName extends StringFieldPath<TFieldValues> = StringFieldPath<TFieldValues>,
>(
  props: FieldInputProps<TFieldValues, TName> & RefAttributes<HTMLInputElement>
) {
  return <FieldInput placeholder="Password" {...props} type="password" />;
}
