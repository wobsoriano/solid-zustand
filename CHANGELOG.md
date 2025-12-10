# Changelog

## 2.0.0

### Major Changes

- 9d58ece: ## Breaking Changes

  ### New Unified API

  The library now uses a unified `create` function with subpath exports instead of separate `createWithSignal` and `createWithStore` functions.

  **Before:**

  ```ts
  import { createWithSignal } from "solid-zustand"; // signal-based
  import { createWithStore } from "solid-zustand"; // store-based
  ```

  **After:**

  ```ts
  import { create } from "solid-zustand"; // signal-based (default)
  import { create } from "solid-zustand/store"; // store-based
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

## v1.7.0

[compare changes](https://github.com/wobsoriano/solid-zustand/compare/v1.5.1...v1.7.0)

### 🏡 Chore

- **release:** V2.0.0 ([8d55674](https://github.com/wobsoriano/solid-zustand/commit/8d55674))
- **release:** V1.6.0 ([f78d98b](https://github.com/wobsoriano/solid-zustand/commit/f78d98b))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))

## v1.6.0

[compare changes](https://github.com/wobsoriano/solid-zustand/compare/v1.5.1...v1.6.0)

### 🏡 Chore

- **release:** V2.0.0 ([8d55674](https://github.com/wobsoriano/solid-zustand/commit/8d55674))

### ❤️ Contributors

- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))

## v2.0.0

[compare changes](https://github.com/wobsoriano/solid-zustand/compare/v1.5.1...v2.0.0)

## v1.5.1

[compare changes](https://github.com/wobsoriano/solid-zustand/compare/v1.5.0...v1.5.1)

### 🩹 Fixes

- Update import statements due to deprecation of default exports ([bcc848e](https://github.com/wobsoriano/solid-zustand/commit/bcc848e))

### 🏡 Chore

- Update deps ([d27db70](https://github.com/wobsoriano/solid-zustand/commit/d27db70))
- Update deps ([f2f0dbf](https://github.com/wobsoriano/solid-zustand/commit/f2f0dbf))
- Update zustand ([b949c4e](https://github.com/wobsoriano/solid-zustand/commit/b949c4e))

### ❤️ Contributors

- Jcha0713 ([@jcha0713](http://github.com/jcha0713))
- Wobsoriano ([@wobsoriano](http://github.com/wobsoriano))
