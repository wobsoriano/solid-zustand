import { createStore as createSolidStore, reconcile, Store } from 'solid-js/store';
import { onCleanup } from 'solid-js';
import type { SetState, State, StoreApi } from 'zustand/vanilla';

export default function createStore<T extends State>(store: StoreApi<T>): [Store<T>, SetState<T>] {
  const [state, setState] = createSolidStore(store.getState());
  const unsubscribe = store.subscribe((newState) => {
      setState(reconcile(newState));
  });
  onCleanup(() => unsubscribe());
  return [state, store.setState];
}