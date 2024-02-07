<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-zustand&background=tiles&project=%20" alt="solid-zustand">
</p>

# solid-zustand

🐻 State management in Solid using [zustand](https://github.com/pmndrs/zustand).

## Install

```sh
pnpm add zustand solid-zustand
```

Demo: https://stackblitz.com/edit/vitejs-vite-tcofpc

## Usage

First create a store

```tsx
import create from 'solid-zustand'

interface BearState {
  bears: number
  increase: () => void
}

const useStore = create<BearState>(set => ({
  bears: 0,
  increase: () => set(state => ({ bears: state.bears + 1 })),
}))
```

Then bind your components, and that's it!

```tsx
function BearCounter() {
  const state = useStore(state => state.bears)
  return <h1>{state().bears} around here ...</h1>
}

function Controls() {
  const increase = useStore(state => state.increase)
  return <button onClick={increase}>one up</button>
}
```

## Recipes

### Fetching everything

```ts
const state = useStore()
```

### Selecting multiple state slices

It detects changes with strict-equality (old === new) by default, this is efficient for atomic state picks.

```ts
const nuts = useStore(state => state.nuts)
const honey = useStore(state => state.honey)
```

If you want to construct a single object with multiple state-picks inside, similar to redux's mapStateToProps, you can tell zustand that you want the object to be diffed shallowly by passing the `shallow` equality function. That function will then be passed to the [`equals`](https://www.solidjs.com/docs/latest/api#options) option of `createSignal`:

```ts
import shallow from 'zustand/shallow'

// Object pick, either state.nuts or state.honey change
const state = useStore(state => ({ nuts: state.nuts, honey: state.honey }), shallow) // state().nuts, state().honey

// Array pick, either state.nuts or state.honey change
const state = useStore(state => [state.nuts, state.honey], shallow) // state()[0], state()[1]
```

## License

MIT
