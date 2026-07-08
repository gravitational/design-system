import type { ConditionalValue } from '@chakra-ui/react';
type Predicate<R = unknown> = (value: unknown, path: string[]) => R;
type IsPlainObject<T> = T extends ConditionalValue<unknown> ? false : T extends Record<string, unknown> ? T extends (...args: unknown[]) => unknown ? false : true : false;
export type LeafValue<T> = T extends ConditionalValue<infer U> ? U : T extends (infer U)[] ? LeafValue<U> : IsPlainObject<T> extends true ? LeafValue<T[keyof T]> : T;
export type MappedObject<T, K> = T extends ConditionalValue<unknown> ? ConditionalValue<K> : {
    [Prop in keyof T]: T[Prop] extends (infer U)[] ? MappedObject<U, K>[] : IsPlainObject<T[Prop]> extends true ? MappedObject<T[Prop], K> : K;
};
export type WalkObjectStopFn = (value: unknown, path: string[]) => boolean;
export interface WalkObjectOptions {
    stop?: WalkObjectStopFn | undefined;
    getKey?(prop: string, value: unknown): string;
}
export declare function walkObject<T, K>(target: T, predicate: Predicate<K>, options?: WalkObjectOptions): MappedObject<T, Predicate<K>>;
export declare function mapObject<T, R>(obj: T, fn: (value: LeafValue<T>) => R): MappedObject<T, R> | R | T;
export {};
