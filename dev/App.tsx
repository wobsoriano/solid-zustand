import type { Component } from 'solid-js'
import { useStore } from './store'

const App: Component = () => {
  return (
    <div>
      <BearCounter />
      <Controls />
    </div>
  )
}

function BearCounter() {
  const bears = useStore(state => state.bears)
  return (
    <h1>
      {bears()}
      {' '}
      around here ...
    </h1>
  )
}

function Controls() {
  const increase = useStore(state => state.increase)
  return <button onClick={increase}>one up</button>
}

export default App
