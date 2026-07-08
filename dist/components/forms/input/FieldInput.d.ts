import type { ReactNode, RefAttributes } from 'react';
import { type FieldValues } from 'react-hook-form';
import type { StringFieldPath } from '../types';
import { type InputProps } from './Input';
export interface FieldInputProps<TFieldValues extends FieldValues = FieldValues, TName extends StringFieldPath<TFieldValues> = StringFieldPath<TFieldValues>> extends InputProps {
    label?: ReactNode;
    name: TName;
    helperText?: ReactNode;
    required?: boolean;
}
export declare function FieldInput<TFieldValues extends FieldValues = FieldValues, TName extends StringFieldPath<TFieldValues> = StringFieldPath<TFieldValues>, TTransformedValues = TFieldValues>({ helperText, name, label, required, ...rest }: FieldInputProps<TFieldValues, TName> & RefAttributes<HTMLInputElement>): import("react/jsx-runtime").JSX.Element;
export declare function FieldInputPassword<TFieldValues extends FieldValues = FieldValues, TName extends StringFieldPath<TFieldValues> = StringFieldPath<TFieldValues>>(props: FieldInputProps<TFieldValues, TName> & RefAttributes<HTMLInputElement>): import("react/jsx-runtime").JSX.Element;
