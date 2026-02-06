import type { ConditionalValue } from '@chakra-ui/react';

const isObject = (v: unknown): v is Record<string, unknown> =>
  v != null && typeof v === 'object' && !Array.isArray(v);

type Predicate<R = unknown> = (value: unknown, path: string[]) => R;

type IsPlainObject<T> =
  T extends ConditionalValue<unknown>
    ? false
    : T extends Record<string, unknown>
      ? T extends (...args: unknown[]) => unknown
        ? false
        : true
      : false;

export type LeafValue<T> =
  T extends ConditionalValue<infer U>
    ? U
    : T extends (infer U)[]
      ? LeafValue<U>
      : IsPlainObject<T> extends true
        ? LeafValue<T[keyof T]>
        : T;

export type MappedObject<T, K> =
  T extends ConditionalValue<unknown>
    ? ConditionalValue<K>
    : {
        [Prop in keyof T]: T[Prop] extends (infer U)[]
          ? MappedObject<U, K>[]
          : IsPlainObject<T[Prop]> extends true
            ? MappedObject<T[Prop], K>
            : K;
      };

export type WalkObjectStopFn = (value: unknown, path: string[]) => boolean;

export interface WalkObjectOptions {
  stop?: WalkObjectStopFn | undefined;
  getKey?(prop: string, value: unknown): string;
}

type Nullable<T> = T | null | undefined;

const isNotNullish = <T>(element: Nullable<T>): element is T => element != null;

export function walkObject<T, K>(
  target: T,
  predicate: Predicate<K>,
  options: WalkObjectOptions = {}
): MappedObject<T, Predicate<K>> {
  const { stop, getKey } = options;

  function inner(value: unknown, path: string[] = []) {
    if (isObject(value) || Array.isArray(value)) {
      const result: Record<string, unknown> = {};

      for (const [prop, child] of Object.entries(value)) {
        const key = getKey?.(prop, child) ?? prop;
        const childPath = [...path, key];

        if (stop?.(value, childPath)) {
          return predicate(value, path);
        }

        const next = inner(child, childPath);

        if (isNotNullish(next)) {
          result[key] = next;
        }
      }

      return result;
    }

    return predicate(value, path);
  }

  return inner(target) as MappedObject<T, Predicate<K>>;
}

export function mapObject<T, R>(
  obj: T,
  fn: (value: LeafValue<T>) => R
): MappedObject<T, R> | R | T {
  if (Array.isArray(obj)) {
    return obj.map(value =>
      isNotNullish(value) ? fn(value as LeafValue<T>) : value
    ) as MappedObject<T, R>;
  }

  if (!isObject(obj)) {
    return isNotNullish(obj) ? fn(obj as LeafValue<T>) : obj;
  }

  return walkObject(obj, value => fn(value as LeafValue<T>)) as MappedObject<
    T,
    R
  >;
}
