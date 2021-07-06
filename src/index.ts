import { Accessor, createSignal, onCleanup } from 'solid-js'
import { SetState, State, StoreApi } from 'zustand/vanilla'

export function createStore<T extends State>(
    store: StoreApi<T>
  ): [Accessor<T>, SetState<T>] {
    if (!store) throw new Error('A zustand store is required.');
    const [signal, setSignal] = createSignal(store.getState());
    const unsub = store.subscribe(setSignal);
    onCleanup(unsub);
    return [signal, store.setState];
}