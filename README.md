# solid-zustand

Zustand state management for Solid.

## Install

```sh
yarn add zustand solid-zustand
```

## Example

```jsx
import create from 'zustand'
import { createStore } from 'solid-zustand'

interface BearState {
  bears: number
  increase: () => void
}

const store = create<BearState>(set => ({
  bears: 0,
  increase: () => set(state => ({ bears: state.bears + 1 }))
}))

function BearCounter() {
  const [state] = createStore(store)
  return <h1>{state().bears} around here ...</h1>
}

function Controls() {
  const [state, setState] = createStore(store)
  return (
    <>
      <button onClick={state().increase}>one up</button>
      <button onClick={() => setState({ bears: 10 })}>make it 10</button>
    </>
  )
}
```

## License

MIT License © 2021 [Robert Soriano](https://github.com/wobsoriano)