export interface Recursive<T> {
  [key: string]: T | Recursive<T>;
}

export interface TokenSchema<T = unknown> {
  value: T;
  description?: string | undefined;
}

type PrimitiveTokenValue = string | number;

type SemanticTokenDefinition = Recursive<
  TokenSchema<PrimitiveTokenValue | Record<string, PrimitiveTokenValue>>
>;

export type ProcessedTokens<T> =
  // oxlint-disable-next-line typescript/no-explicit-any
  T extends TokenSchema<any>
    ? string
    : T extends Record<string, unknown>
      ? { [K in keyof T]: ProcessedTokens<T[K]> }
      : T extends (infer U)[]
        ? ProcessedTokens<U>[]
        : T;

function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function hasValueProperty(obj: unknown): obj is TokenSchema {
  return obj !== null && typeof obj === 'object' && 'value' in obj;
}

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
export const cssVarToTokenPath = new Map<string, string>();

export function tokensToCSSVariables<T extends SemanticTokenDefinition>(
  obj: T
): ProcessedTokens<T> {
  function processNode(node: unknown, path: string[]): unknown {
    if (hasValueProperty(node)) {
      const varName = [...path].map(toKebabCase).join('-');
      const cssVar = `var(--${varName})`;
      // path is ['teleport', 'colors', ...]; chakra token names omit the
      // 'teleport' prefix.
      cssVarToTokenPath.set(cssVar, path.slice(1).join('.'));
      return cssVar;
    }

    if (!node || typeof node !== 'object') {
      return node;
    }

    const nodeAsRecord = node as Record<string, unknown>;

    const result: Record<string, unknown> = {};

    for (const key in nodeAsRecord) {
      if (Object.prototype.hasOwnProperty.call(nodeAsRecord, key)) {
        const newPath = [...path, key];

        result[key] = processNode(nodeAsRecord[key], newPath);
      }
    }

    return result;
  }

  return processNode(obj, ['teleport', 'colors']) as ProcessedTokens<T>;
}
