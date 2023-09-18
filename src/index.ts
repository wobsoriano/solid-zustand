import createWithSignal from './createWithSignal';
import createWithStore from './createWithStore';

const create = createWithStore;

export {
  createWithSignal,
  createWithStore,
};

/**
 * @deprecated Use `import { createWithStore } from 'solid-zustand'` instead.
 */
export default create;
