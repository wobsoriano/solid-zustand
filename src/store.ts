import type { StoreApi } from 'zustand/vanilla'
import type { ExtractState } from './shared'
import { onCleanup } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
import { createFactory } from './shared'

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

const create = createFactory<'store'>(useStore)

export {
  create,
}
