import type { Accessor } from 'solid-js'
import { createSignal, onCleanup } from 'solid-js'
import type { StateCreator, StoreApi } from 'zustand/vanilla'
import { createStore as createZustandStore } from 'zustand/vanilla'
import type { Create, ExtractState, IsFunction } from './types'

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

  if (typeof initialValue === 'function') return initialValue

  const options: Parameters<typeof createSignal>[1] = {}
  if (equalityFn) options.equals = equalityFn as any

  const [signal, setSignal] = createSignal(initialValue, options)

  const unsubscribe = api.subscribe((payload) => {
    const nextStateSlice = selector(payload) as any
    setSignal(nextStateSlice)
  })
  
  onCleanup(() => unsubscribe())

  return signal
}

function createImpl<T extends object>(createState: StateCreator<T, [], []>) {
  const api = typeof createState === 'function' ? createZustandStore(createState) : createState

  const useBoundStore: any = (selector?: any, equalityFn?: any) =>
    useStore(api, selector, equalityFn)

  Object.assign(useBoundStore, api)

  return useBoundStore
}

const create = (<T extends object>(createState: StateCreator<T, [], []> | undefined) =>
  createState ? createImpl(createState) : createImpl) as Create<'signal'>

export default create
