import { render } from 'solid-js/web'
import { shallow } from 'zustand/shallow'
import { beforeEach, describe, expect, it } from 'vitest'
import create from '../src'

interface BearState {
  bears: { count: number }
  bulls: { count: number }
  increase: () => void
}

const useStore = create<BearState>(set => ({
  bears: { count: 0 },
  bulls: { count: 0 },
  increase: () => set(state => ({ bears: { count: state.bears.count + 1 } })),
}))

describe('create', () => {
  beforeEach(() => {
    useStore.setState({ bears: { count: 0 }, bulls: { count: 0 } })
  })

  it('should return default zustand properties', () => {
    expect(typeof useStore.setState).toBe('function')
    expect(typeof useStore.getState).toBe('function')
    expect(typeof useStore.subscribe).toBe('function')
    expect(typeof useStore.destroy).toBe('function')
  })

  it('should function correct when rendering in Solid', () => {
    const div = document.createElement('div')
    render(() => {
      const state = useStore()
      const increase = useStore(state => state.increase)
      expect(state.bears.count).toBe(0)
      increase()
      increase()
      increase()
      return <span>{state.bears.count}</span>
    }, div)
    expect(div.innerHTML).toBe('<span>3</span>')
  })

  it('should allow multiple state slices', () => {
    const div = document.createElement('div')
    render(() => {
      const { bears, bulls } = useStore(
        state => ({ bears: state.bears, bulls: state.bulls }),
        shallow,
      )
      useStore.setState({ bears: { count: 6 }, bulls: { count: 9 } })
      return (
        <span>
          Bears: {bears.count} | Bulls: {bulls.count}
        </span>
      )
    }, div)
    expect(div.textContent).toBe('Bears: 6 | Bulls: 9')
  })
})
