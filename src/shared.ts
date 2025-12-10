import type { Accessor } from 'solid-js'
import type { Mutate, StateCreator, StoreApi, StoreMutatorIdentifier } from 'zustand/vanilla'
import { createStore as createZustandStore } from 'zustand/vanilla'

export type ExtractState<S> = S extends { getState: () => infer T } ? T : never

export type IsFunction<T> = T extends (...args: any[]) => any ? T : never

export type UseBoundStore<S extends StoreApi<unknown>, P extends 'store' | 'signal'> = {
  (): P extends 'store'
    ? ExtractState<S>
    : ExtractState<S> extends IsFunction<ExtractState<S>>
      ? ExtractState<S>
      : Accessor<ExtractState<S>>
  <U>(
    selector: (state: ExtractState<S>) => U,
    equals?: (a: U, b: U) => boolean,
  ): P extends 'store' ? U : U extends IsFunction<U> ? U : Accessor<U>
} & S

export interface Create<P extends 'store' | 'signal'> {
  <T extends object, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
  ): UseBoundStore<Mutate<StoreApi<T>, Mos>, P>
  <T extends object>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>,
  ) => UseBoundStore<Mutate<StoreApi<T>, Mos>, P>
  <S extends StoreApi<unknown>>(store: S): UseBoundStore<S, P>
}

export function createFactory<P extends 'store' | 'signal'>(
  useStore: (api: StoreApi<any>, selector?: any, equalityFn?: any) => any,
): Create<P> {
  function createImpl<T extends object>(createState: StateCreator<T, [], []>) {
    const api = typeof createState === 'function' ? createZustandStore(createState) : createState

    const useBoundStore: any = (selector?: any, equalityFn?: any) =>
      useStore(api, selector, equalityFn)

    Object.assign(useBoundStore, api)

    return useBoundStore
  }

  return (<T extends object>(createState: StateCreator<T, [], []> | undefined) =>
    createState ? createImpl(createState) : createImpl) as Create<P>
}
