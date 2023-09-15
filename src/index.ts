import type { Accessor } from 'solid-js';
import { createSignal, onCleanup } from 'solid-js';
import type {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
} from 'zustand/vanilla';
import { createStore as createZustandStore } from 'zustand/vanilla';

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
  const initialValue = selector(api.getState());

  if (typeof initialValue === 'function')
    return initialValue;

  const options: Parameters<typeof createSignal>[1] = {};

  if (equalityFn) {
    options.equals = (prev, next) => {
      return equalityFn(prev as StateSlice, next as StateSlice);
    };
  }

  const [signal, setSignal] = createSignal(initialValue, options);

  const unsubscribe = api.subscribe(setSignal);
  onCleanup(() => unsubscribe());

  return signal;
}

export type UseBoundStore<S extends StoreApi<unknown>> = {
  (): ExtractState<S> extends (...args: any[]) => any
    ? ExtractState<S>
    : Accessor<ExtractState<S>>
  <U>(
    selector: (state: ExtractState<S>) => U,
    equals?: (a: U, b: U) => boolean
  ): U extends (...args: any[]) => any ? U : Accessor<U>
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

function createImpl<T extends object>(createState: StateCreator<T, [], []>) {
  const api
    = typeof createState === 'function' ? createZustandStore(createState) : createState;

  const useBoundStore: any = (selector?: any, equalityFn?: any) =>
    useStore(api, selector, equalityFn);

  Object.assign(useBoundStore, api);

  return useBoundStore;
}

const create = (<T extends object>(
  createState: StateCreator<T, [], []> | undefined,
) => (createState ? createImpl(createState) : createImpl)) as Create;

export default create;
