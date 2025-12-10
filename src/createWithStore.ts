import type { StateCreator, StoreApi } from 'zustand/vanilla'
import type { Create, ExtractState } from './types'
import { onCleanup } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { createStore as createZustandStore } from 'zustand/vanilla'

export function useStore<S extends StoreApi<unknown>>(api: S): ExtractState<S>

export function useStore<S extends StoreApi<unknown>, U>(
  api: S,
  selector: (state: ExtractState<S>) => U,
  equalityFn?: (a: U, b: U) => boolean,
): U

export function useStore<TState extends object, StateSlice>(
  api: StoreApi<TState>,
  selector: (state: TState) => StateSlice = api.getState as any,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean,
) {
  const initialValue = selector(api.getState()) as any
  const [state, setState] = createStore(initialValue)

  const listener = (nextState: TState, previousState: TState) => {
    const prevStateSlice = selector(previousState)
    const nextStateSlice = selector(nextState)

    if (equalityFn !== undefined) {
      if (!equalityFn(prevStateSlice, nextStateSlice))
        setState(reconcile(nextStateSlice))
    }
    else {
      setState(reconcile(nextStateSlice))
    }
  }

  const unsubscribe = api.subscribe(listener)
  onCleanup(() => unsubscribe())
  return state
}

function createImpl<T extends object>(createState: StateCreator<T, [], []>) {
  const api = typeof createState === 'function' ? createZustandStore(createState) : createState

  const useBoundStore: any = (selector?: any, equalityFn?: any) =>
    useStore(api, selector, equalityFn)

  Object.assign(useBoundStore, api)

  return useBoundStore
}

const create = (<T extends object>(createState: StateCreator<T, [], []> | undefined) =>
  createState ? createImpl(createState) : createImpl) as Create<'store'>

export default create
