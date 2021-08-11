import { render } from 'solid-js/web'
import create from '../src';

interface BearState {
    bears: number;
    increase: () => void;
}

const useStore = create<BearState>(set => ({
    bears: 0,
    increase: () => set(state => ({ bears: state.bears + 1 }))
}));

describe('Testing useStore', () => {
    it('should include setState, getState, subscribe and destroy properties', () => {
        expect(typeof useStore.setState).toBe('function');
        expect(typeof useStore.getState).toBe('function');
        expect(typeof useStore.subscribe).toBe('function');
        expect(typeof useStore.destroy).toBe('function');
    })
    
    it('should function correct when rendering in Solid', () => {
        const div = document.createElement('div');
        render(() => {
            const state = useStore();
            expect(state.bears).toBe(0);
            state.increase();
            state.increase();
            return <span>{state.bears}</span>
        }, div);
        expect(div.innerHTML).toBe('<span>2</span>');
    })
})