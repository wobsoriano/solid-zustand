import { createStore, reconcile } from 'solid-js/store';
import { onCleanup } from 'solid-js';
import createImpl, {
  StateCreator,
  SetState,
  State,
  StoreApi,
  GetState,
  Subscribe,
  Destroy,
  StateSelector,
} from 'zustand/vanilla';

export interface UseStore<T extends State> {
  (): T;
  <U>(selector: StateSelector<T, U>): U;
  setState: SetState<T>;
  getState: GetState<T>;
  subscribe: Subscribe<T>;
  destroy: Destroy;
}

export default function create<TState extends State>(
  createState: StateCreator<TState> | StoreApi<TState>
): UseStore<TState> {
  const api: StoreApi<TState> =
    typeof createState === 'function' ? createImpl(createState) : createState;

  const useStore: any = <StateSlice>(
    selector: StateSelector<TState, StateSlice> = api.getState as any
  ) => {
    const initialValue = selector(api.getState())
    const [state, setState] = createStore(initialValue);
    const unsubscribe = api.subscribe((newState) => {
      setState(reconcile(newState));
    }, selector);
    onCleanup(() => unsubscribe());
    return state;
  }

  Object.assign(useStore, api);

  return useStore;
}