interface Recursive<T> {
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

type ProcessedTokens<T> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends TokenSchema<any>
    ? string
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends { 0: any; 1: any; 2: any }
      ? string[]
      : T extends Record<string, unknown>
        ? { [K in keyof T]: ProcessedTokens<T[K]> }
        : T extends (infer U)[]
          ? ProcessedTokens<U>[]
          : T;

function toKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function isNumericKeys(obj: Record<string, unknown>): boolean {
  const keys = Object.keys(obj);
  return keys.length > 0 && keys.every(key => /^\d+$/.test(key));
}

function hasValueProperty(obj: unknown): obj is TokenSchema {
  return obj !== null && typeof obj === 'object' && 'value' in obj;
}

export function tokensToCSSVariables<T extends SemanticTokenDefinition>(
  obj: T
): ProcessedTokens<T> {
  function processNode(node: unknown, path: string[]): unknown {
    if (hasValueProperty(node)) {
      const varName = [...path].map(toKebabCase).join('-');
      return `var(--${varName})`;
    }

    if (!node || typeof node !== 'object') {
      return node;
    }

    const nodeAsRecord = node as Record<string, unknown>;

    if (isNumericKeys(nodeAsRecord)) {
      const keys = Object.keys(nodeAsRecord).sort(
        (a, b) => Number(a) - Number(b)
      );

      return keys.map(key => {
        const newPath = [...path, key];

        return processNode(nodeAsRecord[key], newPath);
      });
    }

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
