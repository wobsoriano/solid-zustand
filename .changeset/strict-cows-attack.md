---
"solid-zustand": major
---

## Breaking Changes

### New Unified API

The library now uses a unified `create` function with subpath exports instead of separate `createWithSignal` and `createWithStore` functions.

**Before:**
```ts
import { createWithSignal } from 'solid-zustand'  // signal-based (was default)
import { createWithStore } from 'solid-zustand'   // store-based
```

**After:**
```ts
import { create } from 'solid-zustand'           // signal-based (default)
import { create } from 'solid-zustand/store'      // store-based
```

### Zustand v5 Required

⚠️ **Important**: This version now requires **zustand v5** or higher. Make sure to update your zustand dependency:

```bash
pnpm add zustand@^5.0.0
# or
npm install zustand@^5.0.0
# or
yarn add zustand@^5.0.0
```

## Migration Guide

### If you were using `createWithStore` (store-based):

**Option 1: Use the new subpath export (recommended)**
```diff
- import { createWithStore } from 'solid-zustand'
+ import { create } from 'solid-zustand/store'

- const useStore = createWithStore((set) => ({ ... }))
+ const useStore = create((set) => ({ ... }))
```

**Option 2: Keep using deprecated export (still works)**
```ts
import { createWithStore } from 'solid-zustand'  // deprecated but works
```

### If you were using `createWithSignal` (signal-based):

**Option 1: Use the new default export (recommended)**
```diff
- import { createWithSignal } from 'solid-zustand'
+ import { create } from 'solid-zustand'

- const useStore = createWithSignal((set) => ({ ... }))
+ const useStore = create((set) => ({ ... }))
```

**Option 2: Keep using deprecated export (still works)**
```ts
import { createWithSignal } from 'solid-zustand'  // deprecated but works
```

### If you were using the default export:

If you were importing the default export (which was always signal-based):

```diff
- import create from 'solid-zustand'  // was signal-based
+ import { create } from 'solid-zustand'  // now explicit named export

- const useStore = create((set) => ({ ... }))
+ const useStore = create((set) => ({ ... }))
```

## What's New

- Unified `create` API for better developer experience
- Subpath exports (`solid-zustand/store`) for explicit imports
- Improved tree-shaking with separate entry points
- Requires zustand v5+ for better type safety and features
- Backwards compatible: deprecated exports still work

## Deprecated APIs

The following exports are deprecated but will continue to work:

- `createWithSignal` - Use `import { create } from 'solid-zustand'` instead
- `createWithStore` - Use `import { create } from 'solid-zustand/store'` instead

These will be removed in a future major version.
