import { render } from 'solid-js/web'
import create from 'zustand/vanilla';

import { createStore } from '../src';

interface BearState {
    bears: number;
    increase: () => void;
}

const store = create<BearState>(set => ({
    bears: 0,
    increase: () => set(state => ({ bears: state.bears + 1 }))
}));

describe('Testing createStore', () => {
    it('should create store getter and setter', () => {
        const [state, setState] = createStore(store);
        expect(typeof state).toBe('object');
        expect(typeof setState).toBe('function');
    })
    
    it('should function correct when rendering in Solid', () => {
        const div = document.createElement('div');
        const [state] = createStore(store);
        expect(state.bears).toBe(0);
        render(() => {
            state.increase();
            state.increase();
            return <span>{state.bears}</span>
        }, div);
        expect(div.innerHTML).toBe('<span>2</span>');
    })
})