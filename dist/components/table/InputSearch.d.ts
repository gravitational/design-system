import { type ReactNode } from 'react';
export type InputSearchSize = 'small' | 'big';
export interface InputSearchProps {
    searchValue: string;
    setSearchValue: (searchValue: string) => void;
    children?: ReactNode;
    inputSize?: InputSearchSize;
    autoFocus?: boolean;
    placeholder?: string;
    isDisabled?: boolean;
}
export declare function InputSearch({ searchValue, setSearchValue, children, inputSize, autoFocus, placeholder, isDisabled, }: InputSearchProps): import("react/jsx-runtime").JSX.Element;
