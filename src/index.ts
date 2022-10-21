import { createStore, reconcile } from 'solid-js/store';
import { onCleanup } from 'solid-js';
import type {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
} from 'zustand/vanilla';
import createZustandStore from 'zustand/vanilla';

type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

export function useStore<S extends StoreApi<unknown>>(api: S): ExtractState<S>;

export function useStore<S extends StoreApi<unknown>, U>(
  api: S,
  selector: (state: ExtractState<S>) => U,
  equalityFn?: (a: U, b: U) => boolean
): U;

export function useStore<TState extends object, StateSlice>(
  api: StoreApi<TState>,
  selector: (state: TState) => StateSlice = api.getState as any,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean,
) {
  const initialValue = selector(api.getState()) as any;
  const [state, setState] = createStore(initialValue);

  const listener = (nextState: TState, previousState: TState) => {
    const prevStateSlice = selector(previousState);
    const nextStateSlice = selector(nextState);

    if (equalityFn !== undefined) {
      if (!equalityFn(prevStateSlice, nextStateSlice))
        setState(reconcile(nextStateSlice));
    }
    else {
      setState(reconcile(nextStateSlice));
    }
  };

  const unsubscribe = api.subscribe(listener);
  onCleanup(() => unsubscribe());
  return state;
}

export type UseBoundStore<S extends StoreApi<unknown>> = {
  (): ExtractState<S>
  <U>(
    selector: (state: ExtractState<S>) => U,
    equals?: (a: U, b: U) => boolean
  ): U
} & S;

interface Create {
  <T extends object, Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ): UseBoundStore<Mutate<StoreApi<T>, Mos>>
  <T extends object>(): <Mos extends [StoreMutatorIdentifier, unknown][] = []>(
    initializer: StateCreator<T, [], Mos>
  ) => UseBoundStore<Mutate<StoreApi<T>, Mos>>
  <S extends StoreApi<unknown>>(store: S): UseBoundStore<S>
}

const createImpl = <T extends object>(createState: StateCreator<T, [], []>) => {
  const api
    = typeof createState === 'function' ? createZustandStore(createState) : createState;

  const useBoundStore: any = (selector?: any, equalityFn?: any) =>
    useStore(api, selector, equalityFn);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};

const create = (<T extends object>(
  createState: StateCreator<T, [], []> | undefined,
) => (createState ? createImpl(createState) : createImpl)) as Create;

export default create;
