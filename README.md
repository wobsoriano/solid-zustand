# solid-zustand

Zustand state management for Solid.

## Install

```sh
yarn add solid-zustand
```

Demo: https://codesandbox.io/s/solid-zustand-demo-dmt4r

## Example

```jsx
import create from 'solid-zustand'

interface BearState {
  bears: number
  increase: () => void
}

const useStore = create<BearState>(set => ({
  bears: 0,
  increase: () => set(state => ({ bears: state.bears + 1 }))
}))

function BearCounter() {
  const state = useStore()
  return <h1>{state.bears} around here ...</h1>
}

function Controls() {
  const state = useStore()
  return (
    <>
      <button onClick={state.increase}>one up</button>
      {/* Or */}
      <button onClick={() => useStore.setState((prev) => ({ bears: prev.bears + 1 }))}>
        one up
      </button>
    </>
  )
}
```

## Selecting multiple state slices

Since `solid-zustand` uses [createStore](https://www.solidjs.com/docs/latest/api#createstore) to track changes, state slices only works on arrays and plain objects.

```ts
// Works
const useStore = create(set => ({
  bears: {
    count: 0
  },
}))
const bears = useStore(state => state.bears)

// Doesn't
const useStore = create(set => ({
  bears: 0,
}))
const bears = useStore(state => state.bears)
```

## License

MIT License © 2021 [Robert Soriano](https://github.com/wobsoriano)