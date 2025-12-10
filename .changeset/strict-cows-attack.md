---
"solid-zustand": major
---

## Breaking Changes

### New Unified API

The library now uses a unified `create` function with subpath exports instead of separate `createWithSignal` and `createWithStore` functions.

**Before:**
```ts
import { createWithSignal } from 'solid-zustand'  // signal-based
import { createWithStore } from 'solid-zustand'   // store-based
```

**After:**
```ts
import { create } from 'solid-zustand'           // signal-based (default)
import { create } from 'solid-zustand/store'      // store-based
```

### Requirements

⚠️ **Requires zustand v5** or higher.

## Migration Guide

### Using `createWithSignal`:

```diff
- import { createWithSignal } from 'solid-zustand'
+ import { create } from 'solid-zustand'

- const useStore = createWithSignal((set) => ({ ... }))
+ const useStore = create((set) => ({ ... }))
```

### Using `createWithStore`:

```diff
- import { createWithStore } from 'solid-zustand'
+ import { create } from 'solid-zustand/store'

- const useStore = createWithStore((set) => ({ ... }))
+ const useStore = create((set) => ({ ... }))
```

### Using default export:

```diff
- import create from 'solid-zustand'
+ import { create } from 'solid-zustand'

- const useStore = create((set) => ({ ... }))
+ const useStore = create((set) => ({ ... }))
```

## Deprecated APIs

The following exports are deprecated but still work:

- `createWithSignal` → Use `import { create } from 'solid-zustand'`
- `createWithStore` → Use `import { create } from 'solid-zustand/store'`

These will be removed in a future major version.
