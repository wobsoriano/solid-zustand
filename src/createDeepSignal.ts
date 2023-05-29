import type { Signal } from 'solid-js';
import { createStore, reconcile, unwrap } from 'solid-js/store';

export function createDeepSignal<T>(value: T): Signal<T> {
  const [store, setStore] = createStore({
    value,
  });
  return [
    () => store.value,
    (v: T) => {
      const unwrapped = unwrap(store.value);
      typeof v === 'function' && (v = v(unwrapped));
      setStore('value', reconcile(v));
      return store.value;
    },
  ] as Signal<T>;
}
