export interface Recursive<T> {
    [key: string]: T | Recursive<T>;
}
export interface TokenSchema<T = unknown> {
    value: T;
    description?: string | undefined;
}
type PrimitiveTokenValue = string | number;
type SemanticTokenDefinition = Recursive<TokenSchema<PrimitiveTokenValue | Record<string, PrimitiveTokenValue>>>;
export type ProcessedTokens<T> = T extends TokenSchema<any> ? string : T extends Record<string, unknown> ? {
    [K in keyof T]: ProcessedTokens<T[K]>;
} : T extends (infer U)[] ? ProcessedTokens<U>[] : T;
/**
 * Maps a generated CSS variable reference (e.g.
 * `"var(--teleport-colors-terminal-foreground)"`) back to its Chakra token
 * name (e.g. `"colors.terminal.foreground"`). Populated as a side effect of
 * {@link tokensToCSSVariables}, so it stays consistent with whatever the
 * legacy var-string structure currently exposes. Shared across themes — they
 * all walk structurally identical source trees and therefore produce the same
 * mappings.
 *
 * Lets `resolveColorTokens` accept the existing var-string subtrees (such as
 * `theme.colors.terminal`) without callers having to maintain a parallel
 * list of token paths.
 */
export declare const cssVarToTokenPath: Map<string, string>;
export declare function tokensToCSSVariables<T extends SemanticTokenDefinition>(obj: T): ProcessedTokens<T>;
export {};
