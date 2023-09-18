import { render } from 'solid-js/web';
import { shallow } from 'zustand/shallow';
import { beforeEach, describe, expect, it } from 'vitest';
import { createWithSignal } from '../src';

interface BearState {
  bears: number
  bulls: number
  increase: () => void
}

const useStore = createWithSignal<BearState>(set => ({
  bears: 0,
  bulls: 0,
  increase: () => set(state => ({ bears: state.bears + 1 })),
}));

describe('create', () => {
  beforeEach(() => {
    useStore.setState({ bears: 0, bulls: 0 });
  });

  it('should return default zustand properties', () => {
    expect(typeof useStore.setState).toBe('function');
    expect(typeof useStore.getState).toBe('function');
    expect(typeof useStore.subscribe).toBe('function');
  });

  it('should function correct when rendering in Solid', () => {
    const div = document.createElement('div');
    render(() => {
      const state = useStore();
      const increase = useStore(state => state.increase);
      expect(state().bears).toBe(0);
      increase();
      increase();
      increase();
      return <span>{state().bears}</span>;
    }, div);
    expect(div.innerHTML).toBe('<span>3</span>');
  });

  it('should allow multiple state slices', () => {
    const div = document.createElement('div');
    render(() => {
      const state = useStore(state => ({ bears: state.bears, bulls: state.bulls }), shallow);
      useStore.setState({ bears: 6, bulls: 9 });
      return <span>Bears: {state().bears} | Bulls: {state().bulls}</span>;
    }, div);
    expect(div.textContent).toBe('Bears: 6 | Bulls: 9');
  });
});
