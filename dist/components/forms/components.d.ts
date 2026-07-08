import type { FieldValues } from 'react-hook-form';
import { FieldInput, FieldInputPassword } from './input';
export declare function useFieldComponents<TFieldValues extends FieldValues>(): FieldComponents<TFieldValues>;
export interface FieldComponents<TFieldValues extends FieldValues> {
    FieldInput: typeof FieldInput<TFieldValues>;
    FieldInputPassword: typeof FieldInputPassword<TFieldValues>;
}
