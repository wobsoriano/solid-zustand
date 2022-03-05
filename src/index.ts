import { createStore, reconcile } from 'solid-js/store'
import { onCleanup } from 'solid-js'
import type {
  EqualityChecker,
  GetState,
  SetState,
  State,
  StateCreator,
  StateSelector,
  StoreApi,
} from 'zustand/vanilla'
import createImpl from 'zustand/vanilla'

type UseBoundStore<
  T extends State,
  CustomStoreApi extends StoreApi<T> = StoreApi<T>,
> = {
  (): T
  <U>(selector: StateSelector<T, U>, equalityFn?: EqualityChecker<U>): U
} & CustomStoreApi

export default function create<
  TState extends State,
  CustomSetState = SetState<TState>,
  CustomGetState = GetState<TState>,
  CustomStoreApi extends StoreApi<TState> = StoreApi<TState>,
>(
  createState:
  | StateCreator<TState, CustomSetState, CustomGetState, CustomStoreApi>
  | CustomStoreApi,
): UseBoundStore<TState, CustomStoreApi> {
  const api: StoreApi<TState>
    = typeof createState === 'function' ? createImpl(createState) : createState

  const useStore: any = <StateSlice>(
    selector: StateSelector<TState, StateSlice> = api.getState as any,
    equalityFn: EqualityChecker<StateSlice> = Object.is,
  ) => {
    const initialValue = selector(api.getState())
    const [state, setState] = createStore(initialValue)

    const listener = () => {
      const nextState = api.getState()
      const nextStateSlice = selector(nextState)

      try {
        // @ts-expect-error: Incompatible types
        if (!equalityFn(state, nextStateSlice))
          setState(reconcile(nextStateSlice))
      }
      catch (e) {
        setState(reconcile(nextStateSlice))
      }
    }

    const unsubscribe = api.subscribe(listener)
    onCleanup(() => unsubscribe())
    return state
  }

  Object.assign(useStore, api)

  return useStore
}
