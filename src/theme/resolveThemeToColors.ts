type ThemeValue = string | string[] | { [key: string]: ThemeValue };
type ResolvedTheme<T> = T extends string
  ? string
  : T extends string[]
    ? string[]
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
      T extends Record<string, any>
      ? { [K in keyof T]: ResolvedTheme<T[K]> }
      : never;

export function resolveThemeToColors<T extends Record<string, ThemeValue>>(
  theme: T
): ResolvedTheme<T> {
  const styles = getComputedStyle(document.documentElement);

  const resolveValue = <V extends ThemeValue>(value: V): ResolvedTheme<V> => {
    if (typeof value === 'string') {
      const varMatch = /^var\((--[a-zA-Z0-9-_]+)\)$/.exec(value);

      return (
        varMatch ? styles.getPropertyValue(varMatch[1]).trim() : value
      ) as ResolvedTheme<V>;
    }

    if (Array.isArray(value)) {
      return value.map(v => {
        const varMatch = /^var\((--[a-zA-Z0-9-_]+)\)$/.exec(v);

        if (!varMatch) {
          return v;
        }

        return styles.getPropertyValue(varMatch[1]).trim();
      }) as ResolvedTheme<V>;
    }

    const resolved: Record<string, ResolvedTheme<ThemeValue>> = {};

    for (const [key, val] of Object.entries(value)) {
      resolved[key] = resolveValue(val);
    }

    return resolved as ResolvedTheme<V>;
  };

  return resolveValue(theme);
}
