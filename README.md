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

## License

MIT License © 2021 [Robert Soriano](https://github.com/wobsoriano)