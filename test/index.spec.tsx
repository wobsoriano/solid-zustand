import { render } from 'solid-js/web'
import create, { shallow } from '../src';

interface BearState {
    bears: number;
    increase: () => void;
    decrease: () => void;
}

const useStore = create<BearState>(set => ({
    bears: 0,
    increase: () => set(state => ({ bears: state.bears + 1 })),
    decrease: () => set(state => ({ bears: state.bears - 1 }))
}));

describe('Default properties', () => {
    it('should include setState, getState, subscribe and destroy properties', () => {
        expect(typeof useStore.setState).toBe('function');
        expect(typeof useStore.getState).toBe('function');
        expect(typeof useStore.subscribe).toBe('function');
        expect(typeof useStore.destroy).toBe('function');
    })
})

describe('Single state-picks', () => {
    it('should function correct when rendering in Solid', () => {
        const div = document.createElement('div');
        render(() => {
            const state = useStore();
            const increase = useStore(state => state.increase);
            expect(state.bears).toBe(0);
            increase();
            increase();
            increase();
            state.decrease();
            return <span>{state.bears}</span>
        }, div);
        expect(div.innerHTML).toBe('<span>2</span>');
    })
})

describe('Multiple state-picks with shallow', () => {
    it('should function correct when rendering in Solid', () => {
        const useStore = create<{ bears: { count: number }, bulls: { count: number } }>(() => ({
            bears: {
                count: 0
            },
            bulls: {
                count: 0
            }
        }));
        const div = document.createElement('div');
        render(() => {
            const [bears] = useStore(state => [state.bears, state.bulls], shallow)
            useStore.setState(({ bears }) => ({ bears: { count: bears.count + 1 } }))
            useStore.setState(({ bears }) => ({ bears: { count: bears.count + 1 } }))
            return <span>{bears.count}</span>
        }, div);
        expect(div.innerHTML).toBe('<span>2</span>');
    })
})