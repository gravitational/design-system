import { type SystemConfig } from '@chakra-ui/react';
export declare function createThemeSystem(...configs: SystemConfig[]): import("@chakra-ui/react").SystemContext;
export interface TokenSchema<T = any> {
    value: T;
    description?: string | undefined;
}
type HasOnlyLightDark<T> = T extends {
    _light: any;
    _dark: any;
} ? keyof T extends '_light' | '_dark' ? true : false : false;
type ExtractExtraKeys<T> = T extends {
    _light: any;
    _dark: any;
} ? Exclude<keyof T, '_light' | '_dark'> : never;
export type SingleColorTheme<T> = T extends TokenSchema ? T['value'] extends string | number ? T : HasOnlyLightDark<T['value']> extends true ? {
    value: string;
} : T['value'] extends object ? {
    value: {
        base: string;
    } & Record<ExtractExtraKeys<T['value']>, string>;
} : T : T extends object ? {
    [K in keyof T]: SingleColorTheme<T[K]>;
} : never;
export { tokensToCSSVariables } from './legacy';
export { resolveColorToken, type ColorMode } from './resolveColorToken';
export { resolveColorTokens, type TokenTree } from './resolveColorTokens';
export { resolveThemeToColors } from './resolveThemeToColors';
