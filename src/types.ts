import type { Accessor } from 'solid-js';
import type { Mutate, StateCreator, StoreApi, StoreMutatorIdentifier } from 'zustand/vanilla';

export type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

export type IsFunction<T> = T extends (...args: any[]) => any ? T : never;

export type UseBoundStore<S extends StoreApi<unknown>, P extends 'store' | 'signal'> = {
  (): P extends 'store' ? ExtractState<S> : ExtractState<S> extends IsFunction<ExtractState<S>> ? ExtractState<S> : Accessor<ExtractState<S>>
  <U>(
    selector: (state: ExtractState<S>) => U,
    equals?: (a: U, b: U) => boolean
  ): P extends 'store' ? U : U extends IsFunction<U> ? U : Accessor<U>
} & S;

export interface Create<P extends 'store' | 'signal'> {
  <T extends object, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ): UseBoundStore<Mutate<StoreApi<T>, Mos>, P>
  <T extends object>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ) => UseBoundStore<Mutate<StoreApi<T>, Mos>, P>
  <S extends StoreApi<unknown>>(store: S): UseBoundStore<S, P>
}
