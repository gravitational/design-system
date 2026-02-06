import type { FieldPath, FieldPathValue, FieldValues } from 'react-hook-form';

export type FieldPathByValue<TFieldValues extends FieldValues, TValue> = {
  [K in FieldPath<TFieldValues>]: FieldPathValue<TFieldValues, K> extends TValue
    ? K
    : never;
}[FieldPath<TFieldValues>];

export type StringFieldPath<TFieldValues extends FieldValues> =
  FieldPathByValue<TFieldValues, string | undefined>;
