import { createStore, reconcile } from 'solid-js/store';
import { onCleanup } from 'solid-js';
import type {
  EqualityChecker,
  GetState,
  SetState,
  State,
  StateCreator,
  StateSelector,
  StoreApi,
} from 'zustand/vanilla';
import createZustandStore from 'zustand/vanilla';

export type UseBoundStore<
  T extends State,
  CustomStoreApi extends StoreApi<T> = StoreApi<T>,
> = {
  (): T
  <U>(selector: StateSelector<T, U>, equalityFn?: EqualityChecker<U>): U
} & CustomStoreApi;

function create<
  TState extends State,
  CustomSetState,
  CustomGetState,
  CustomStoreApi extends StoreApi<TState>,
>(
  createState:
  | StateCreator<TState, CustomSetState, CustomGetState, CustomStoreApi>
  | CustomStoreApi
): UseBoundStore<TState, CustomStoreApi>;

function create<TState extends State>(
  createState:
  | StateCreator<TState, SetState<TState>, GetState<TState>, any>
  | StoreApi<TState>
): UseBoundStore<TState, StoreApi<TState>>;

function create<
  TState extends State,
  CustomSetState,
  CustomGetState,
  CustomStoreApi extends StoreApi<TState>,
>(
  createState:
  | StateCreator<TState, CustomSetState, CustomGetState, CustomStoreApi>
  | CustomStoreApi,
): UseBoundStore<TState, CustomStoreApi> {
  const api: CustomStoreApi
    = typeof createState === 'function' ? createZustandStore(createState) : createState;

  const useStore: any = <StateSlice>(
    selector: StateSelector<TState, StateSlice> = api.getState as any,
    equalityFn: EqualityChecker<StateSlice> = Object.is,
  ) => {
    const initialValue = selector(api.getState());
    const [state, setState] = createStore(initialValue);

    const listener = () => {
      const nextState = api.getState();
      const nextStateSlice = selector(nextState);

      try {
        if (!equalityFn(state, nextStateSlice)) {
          // @ts-expect-error: types
          setState(reconcile(nextStateSlice));
        }
      }
      catch (e) {}
    };

    const unsubscribe = api.subscribe(listener);
    onCleanup(() => unsubscribe());
    return state;
  };

  Object.assign(useStore, api);

  return useStore;
}

export default create;
