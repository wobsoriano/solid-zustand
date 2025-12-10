import { create } from './signal'
import { create as createStore } from './store'

export { create }

/**
 * @deprecated Use `import { create } from 'solid-zustand'` instead
 */
const createWithSignal = create
export { createWithSignal }

/**
 * @deprecated Use `import { create } from 'solid-zustand/store'` instead
 */
const createWithStore = createStore
export { createWithStore }
