import type { Accessor } from 'solid-js'
import type { StoreApi } from 'zustand/vanilla'
import type { ExtractState, IsFunction } from './shared'
import { createSignal, onCleanup } from 'solid-js'
import { createFactory } from './shared'

export function useStore<S extends StoreApi<unknown>>(
  api: S,
): ExtractState<S> extends IsFunction<ExtractState<S>> ? ExtractState<S> : Accessor<ExtractState<S>>

export function useStore<S extends StoreApi<unknown>, U>(
  api: S,
  selector: (state: ExtractState<S>) => U,
  equalityFn?: (a: U, b: U) => boolean,
): U extends IsFunction<U> ? U : Accessor<U>

export function useStore<TState extends object, StateSlice>(
  api: StoreApi<TState>,
  selector: (state: TState) => StateSlice = api.getState as any,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean,
) {
  const initialValue = selector(api.getState())

  if (typeof initialValue === 'function')
    return initialValue

  const options: Parameters<typeof createSignal>[1] = {}
  if (equalityFn)
    options.equals = equalityFn as any

  const [signal, setSignal] = createSignal(initialValue, options)

  const unsubscribe = api.subscribe((payload) => {
    const nextStateSlice = selector(payload) as any
    setSignal(nextStateSlice)
  })

  onCleanup(() => unsubscribe())

  return signal
}

const create = createFactory<'signal'>(useStore)

export {
  create,
}
