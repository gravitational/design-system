import { useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';

import { FieldInput, FieldInputPassword } from './input';

export function useFieldComponents<
  TFieldValues extends FieldValues,
>(): FieldComponents<TFieldValues> {
  return useMemo(() => createFieldComponents<TFieldValues>(), []);
}

export interface FieldComponents<TFieldValues extends FieldValues> {
  FieldInput: typeof FieldInput<TFieldValues>;
  FieldInputPassword: typeof FieldInputPassword<TFieldValues>;
}

function createFieldComponents<
  TFieldValues extends FieldValues,
>(): FieldComponents<TFieldValues> {
  return {
    FieldInput: FieldInput<TFieldValues>,
    FieldInputPassword: FieldInputPassword<TFieldValues>,
  };
}
