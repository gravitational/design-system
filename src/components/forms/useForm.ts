/* eslint-disable @typescript-eslint/no-explicit-any */

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import {
  useForm as useFormInternal,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormProps as UseFormInternalProps,
  type UseFormReturn as UseFormReturnInternal,
} from 'react-hook-form';
import { type $ZodType, type input, type output } from 'zod/v4/core';

import { useFieldComponents, type FieldComponents } from './components';

type FormSchema<
  TOutput extends FieldValues = FieldValues,
  TInput extends FieldValues = TOutput,
> = $ZodType<TOutput, TInput>;

type InferFieldValues<T> =
  T extends Resolver<infer TFieldValues, any, any> ? TFieldValues : FieldValues;

type InferTransformedValues<T> =
  T extends Resolver<any, any, infer TTransformed> ? TTransformed : FieldValues;

type BaseFormProps<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = TFieldValues,
> = Omit<
  UseFormInternalProps<TFieldValues, TContext, TTransformedValues>,
  'defaultValues' | 'resolver'
>;

interface UseFormPropsWithSchema<TSchema extends FormSchema, TContext = any>
  extends BaseFormProps<input<TSchema>, TContext, output<TSchema>> {
  resolver?: never;
  defaultValues?: DefaultValues<input<TSchema>>;
}

interface UseFormPropsWithResolver<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = TFieldValues,
> extends BaseFormProps<TFieldValues, TContext, TTransformedValues> {
  resolver: Resolver<TFieldValues, TContext, TTransformedValues>;
  defaultValues?: DefaultValues<TFieldValues>;
}

interface UseFormPropsWithoutValidation<
  TFieldValues extends FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = TFieldValues,
> extends BaseFormProps<TFieldValues, TContext, TTransformedValues> {
  resolver?: never;
  defaultValues?: DefaultValues<TFieldValues>;
}

export type UseFormProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = TFieldValues,
> =
  | UseFormPropsWithResolver<TFieldValues, TContext, TTransformedValues>
  | UseFormPropsWithoutValidation<TFieldValues, TContext, TTransformedValues>;

export interface UseFormReturn<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues = TFieldValues,
> extends UseFormReturnInternal<TFieldValues, TContext, TTransformedValues>,
    FieldComponents<TFieldValues> {}

/**
 * useForm hook that integrates react-hook-form with Zod schema validation.
 *
 * This hook sets up the form with default 'onBlur' mode and applies Zod resolver if a schema is provided.
 * It also includes wrapped, typed field components for easier form field creation.
 *
 * @example
 * // With schema (as second argument)
 * const form = useForm({ defaultValues: { name: '' } }, someZodSchema);
 *
 * @example
 * // With resolver (as second argument)
 * const form = useForm({ defaultValues: { name: '' } }, customResolver);
 *
 * @example
 * // Without validation
 * interface FormValues {
 *   name: string;
 * }
 * const form = useForm<FormValues>({ defaultValues: { name: '' } });
 */
export function useForm<
  TSchemaOrResolver extends FormSchema | Resolver<any, any, any>,
  TContext = unknown,
>(
  props: TSchemaOrResolver extends FormSchema
    ? UseFormPropsWithSchema<TSchemaOrResolver, TContext>
    : TSchemaOrResolver extends Resolver<any, any, any>
      ? UseFormPropsWithSchema<
          FormSchema<
            InferTransformedValues<TSchemaOrResolver>,
            InferFieldValues<TSchemaOrResolver>
          >,
          TContext
        >
      : never,
  schemaOrResolver: TSchemaOrResolver
): TSchemaOrResolver extends FormSchema
  ? UseFormReturn<input<TSchemaOrResolver>, TContext, output<TSchemaOrResolver>>
  : TSchemaOrResolver extends Resolver<any, any, any>
    ? UseFormReturn<
        InferFieldValues<TSchemaOrResolver>,
        TContext,
        InferTransformedValues<TSchemaOrResolver>
      >
    : never;

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = TFieldValues,
>(
  props?: UseFormPropsWithoutValidation<
    TFieldValues,
    TContext,
    TTransformedValues
  >
): UseFormReturn<TFieldValues, TContext, TTransformedValues>;

export function useForm<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues = TFieldValues,
>(
  props?: UseFormProps<TFieldValues, TContext, TTransformedValues>,
  schemaOrResolver?: FormSchema | Resolver<any, any, any>
): UseFormReturn<TFieldValues, TContext, TTransformedValues> {
  const form = useFormInternal<TFieldValues, TContext, TTransformedValues>({
    mode: 'onChange',
    ...(props as UseFormInternalProps<
      TFieldValues,
      TContext,
      TTransformedValues
    >),
    resolver: (schemaOrResolver
      ? typeof schemaOrResolver === 'function'
        ? schemaOrResolver
        : zodResolver(schemaOrResolver)
      : undefined) as
      | Resolver<TFieldValues, TContext, TTransformedValues>
      | undefined,
  });

  const fieldComponents = useFieldComponents<TFieldValues>();

  return useMemo(
    () => ({
      ...form,
      ...fieldComponents,
    }),
    [form, fieldComponents]
  );
}
