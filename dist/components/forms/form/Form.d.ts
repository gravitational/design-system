import { type HTMLChakraProps } from '@chakra-ui/react';
import { type PropsWithChildren, type RefAttributes } from 'react';
import { type FieldValues, type SubmitHandler } from 'react-hook-form';
import { type UseFormReturn } from '../useForm';
export interface FormProps<TFieldValues extends FieldValues, TContext = any, TTransformedValues extends FieldValues = TFieldValues> extends Omit<HTMLChakraProps<'form'>, 'onSubmit'> {
    form: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
    onSubmit?: SubmitHandler<TTransformedValues>;
}
export declare function Form<TFieldValues extends FieldValues, TContext = any, TTransformedValues extends FieldValues = TFieldValues>({ children, form, onSubmit, ...rest }: PropsWithChildren<FormProps<TFieldValues, TContext, TTransformedValues>> & RefAttributes<HTMLFormElement>): import("react/jsx-runtime").JSX.Element;
