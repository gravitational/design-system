type ThemeValue = string | string[] | {
    [key: string]: ThemeValue;
};
type ResolvedTheme<T> = T extends string ? string : T extends string[] ? string[] : T extends Record<string, any> ? {
    [K in keyof T]: ResolvedTheme<T[K]>;
} : never;
export declare function resolveThemeToColors<T extends ThemeValue>(theme: T): ResolvedTheme<T>;
export {};
