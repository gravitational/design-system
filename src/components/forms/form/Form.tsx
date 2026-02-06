import { chakra, type HTMLChakraProps } from '@chakra-ui/react';
import {
  useCallback,
  type FormEvent,
  type PropsWithChildren,
  type RefAttributes,
} from 'react';
import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
} from 'react-hook-form';

import { type UseFormReturn } from '../useForm';

export interface FormProps<
  TFieldValues extends FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues extends FieldValues = TFieldValues,
> extends Omit<HTMLChakraProps<'form'>, 'onSubmit'> {
  form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  onSubmit?: SubmitHandler<TTransformedValues>;
}

export function Form<
  TFieldValues extends FieldValues,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TContext = any,
  TTransformedValues extends FieldValues = TFieldValues,
>({
  children,
  form,
  onSubmit,
  ...rest
}: PropsWithChildren<FormProps<TFieldValues, TContext, TTransformedValues>> &
  RefAttributes<HTMLFormElement>) {
  const handleSubmit = useCallback(
    (event: FormEvent) => {
      if (!onSubmit) {
        return;
      }

      void form.handleSubmit(onSubmit)(event);
    },
    [form, onSubmit]
  );

  return (
    <FormProvider<TFieldValues, TContext, TTransformedValues> {...form}>
      <chakra.form {...rest} onSubmit={handleSubmit}>
        {children}
      </chakra.form>
    </FormProvider>
  );
}
