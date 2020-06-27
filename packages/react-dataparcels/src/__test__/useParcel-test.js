// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcel from '../useParcel';
import promisify from 'dataparcels/promisify';

jest.useFakeTimers();

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

describe('useParcel source', () => {

    it('should create a Parcel from source', () => {
        let {result} = renderHook(() => useParcel({
            source: () => ({
                value: 123
            })
        }));
        expect(result.current.value).toBe(123);
    });

    it('should store the value from first render', () => {
        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcel({
            source: () => ({
                value: props.foo
            })
        }));

        expect(result.current.value).toBe(123);

        act(() => {
            rerender({foo: 456});
        });

        expect(result.current.value).toBe(123);
    });

    it('should not require source', () => {
        let {result} = renderHook(() => useParcel({}));
        expect(result.current.value).toBe(undefined);
    });

    it('should initially have a frame of 1', () => {
        let {result} = renderHook(() => useParcel({
            source: () => ({
                value: 123
            })
        }));
        expect(result.current._frameMeta.frame).toBe(1);
    });

});

describe('useParcel dependencies', () => {

    it('should update if dependencies change', () => {

        let sourceFn = jest.fn();

        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcel({
            source: (prev) => {
                sourceFn(prev);
                return {
                    value: props.foo
                };
            },
            dependencies: [null, props.foo]
        }));

        expect(result.current.value).toBe(123);
        expect(sourceFn).toHaveBeenCalledTimes(1);
        expect(sourceFn.mock.calls[0][0].value).toBe(undefined);

        act(() => {
            rerender({foo: 456});
        });

        expect(result.current.value).toBe(456);
        expect(sourceFn).toHaveBeenCalledTimes(2);
        expect(sourceFn.mock.calls[1][0].value).toBe(123);

        act(() => {
            rerender({foo: 456});
        });

        expect(result.current.value).toBe(456);
        expect(sourceFn).toHaveBeenCalledTimes(2);

    });

});

describe('useParcel onChange', () => {

    it('should be called when changes occur', () => {

        let onChange = jest.fn();

        let {result} = renderHook(() => useParcel({
            source: () => ({
                value: 123
            }),
            onChange
        }));

        expect(result.current.value).toBe(123);
        expect(onChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.set(456);
        });

        expect(result.current.value).toBe(456);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toBe(456);
    });

    it('should increment frame', () => {

        let onChange = jest.fn();

        let {result} = renderHook(() => useParcel({
            source: () => ({
                value: 123
            }),
            onChange
        }));

        act(() => {
            result.current.set(456);
        });

        expect(result.current._frameMeta.frame).toBe(2);
    });

});

describe('useParcel derive (when buffer is not set)', () => {

    it('should derive from initial source and prop change', () => {

        let derive = jest.fn(({value}) => ({value: value + 1}));

        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcel({
            source: (prev) => ({
                value: props.foo
            }),
            dependencies: [props.foo],
            derive
        }));

        expect(derive).toHaveBeenCalledTimes(1);
        expect(derive.mock.calls[0][0].value).toBe(123);
        expect(result.current.value).toBe(124);

        act(() => {
            rerender({foo: 456});
        });

        expect(derive).toHaveBeenCalledTimes(2);
        expect(derive.mock.calls[1][0].value).toBe(456);
        expect(result.current.value).toBe(457);

    });

    it('should derive from change', () => {

        let derive = jest.fn(({value}) => ({value: value + 1}));
        let onChange = jest.fn();

        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcel({
            source: (prev) => ({
                value: props.foo
            }),
            dependencies: [props.foo],
            derive,
            onChange
        }));

        act(() => {
            result.current.set(789);
        });

        expect(derive).toHaveBeenCalledTimes(2);
        expect(derive.mock.calls[1][0].value).toBe(789);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toBe(790);
        expect(result.current.value).toBe(790);

    });

});

describe('useParcel derive (when buffer is set)', () => {

    it('should derive from above', () => {

        let derive = ({value}) => ({value: value * 2});

        let {result} = renderHook(() => useParcel({
            source: (prev) => ({
                value: 100
            }),
            buffer: true,
            derive
        }));

        expect(result.current.value).toBe(200);
    });

    it('should derive from below', () => {

        let derive = ({value}) => ({value: value * 2});

        let {result} = renderHook(() => useParcel({
            source: (prev) => ({
                value: 100
            }),
            buffer: true,
            derive
        }));

        act(() => {
            result.current.set(200);
        });

        expect(result.current.value).toBe(400);
    });

});



describe('useParcel buffer', () => {

    it('should use useBuffer if buffer = true', () => {

        let onChange = jest.fn();

        let {result} = renderHook(() => useParcel({
            source: () => ({
                value: []
            }),
            onChange,
            buffer: true
        }));

        expect(result.current.meta.synced).toBe(true);
        expect(onChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.push("A");
        });

        expect(result.current.meta.synced).toBe(false);
        expect(onChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.push("B");
        });

        expect(result.current.meta.synced).toBe(false);
        expect(onChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.meta.submit();
        });

        expect(result.current.meta.synced).toBe(true);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toEqual(["A", "B"]);
    });
});

describe('useParcel deriveSource (only used when buffer is set)', () => {

    it('should derive from initial source and prop change', () => {

        let deriveSource = jest.fn(({value}) => ({value: value + 1}));

        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcel({
            source: (prev) => ({
                value: props.foo
            }),
            dependencies: [props.foo],
            buffer: true,
            deriveSource
        }));

        expect(deriveSource).toHaveBeenCalledTimes(1);
        expect(deriveSource.mock.calls[0][0].value).toBe(123);
        expect(result.current.value).toBe(124);

        act(() => {
            rerender({foo: 456});
        });

        expect(deriveSource).toHaveBeenCalledTimes(2);
        expect(deriveSource.mock.calls[1][0].value).toBe(456);
        expect(result.current.value).toBe(457);

    });

    it('should deriveSource from change', () => {

        let deriveSource = jest.fn(({value}) => ({value: value + 1}));
        let onChange = jest.fn();

        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcel({
            source: (prev) => ({
                value: props.foo
            }),
            dependencies: [props.foo],
            buffer: true,
            deriveSource,
            onChange
        }));

        act(() => {
            result.current.set(789);
            result.current.meta.submit();
        });

        expect(deriveSource).toHaveBeenCalledTimes(2);
        expect(deriveSource.mock.calls[1][0].value).toBe(789);
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toBe(790);
        expect(result.current.value).toBe(790);

    });

});

describe('useParcel revert', () => {

    it('should revert changes if using promisify in onChange and the request fails', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let onChange = jest.fn();

        let {result} = renderHook(() => useParcel({
            source: () => ({
                value: []
            }),
            onChange: promisify({
                key: 'save',
                effect: async () => {
                    throw new Error('NO!');
                }
            }),
            buffer: true
        }));

        act(() => {
            result.current.push("A");
            result.current.push("B");
            result.current.push("C");
            result.current.meta.submit();
        });

        expect(result.current.meta.saveStatus).toBe('pending');
        expect(result.current.meta._history.length).toBe(4);

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.value).toEqual(["A","B","C"]);
        expect(result.current.meta.saveStatus).toBe('rejected');
        expect(result.current.meta._history.length).toBe(4);
        expect(result.current.meta._baseIndex).toBe(0);

        act(() => {
            result.current.meta.undo();
            result.current.meta.undo();
        });

        expect(result.current.value).toEqual(["A"]);

        window.setTimeout = realSetTimeout;
    });

    it('should be normal if using promisify in onChange and the request succeeds', async () => {

        // remove setTimeout because jest doesnt handle
        // setTimeouts and promises all mixed together like this
        let realSetTimeout = window.setTimeout;
        window.setTimeout = (fn, ms) => fn();

        let onChange = jest.fn();

        let {result} = renderHook(() => useParcel({
            source: () => ({
                value: []
            }),
            onChange: promisify({
                key: 'save',
                effect: async () => {}
            }),
            buffer: true
        }));

        act(() => {
            result.current.push("A");
            result.current.push("B");
            result.current.push("C");
            result.current.meta.submit();
        });

        expect(result.current.meta.saveStatus).toBe('pending');
        expect(result.current.meta._history.length).toBe(4);

        await act(async () => {
            await Promise.resolve();
        });

        expect(result.current.value).toEqual(["A","B","C"]);
        expect(result.current.meta.saveStatus).toBe('resolved');
        expect(result.current.meta._history.length).toBe(1);
        expect(result.current.meta._baseIndex).toBe(0);

        window.setTimeout = realSetTimeout;
    });
});


describe('useParcel types', () => {
    it('should create a Parcel with types', () => {
        let types = jest.fn(ii => ii);

        let {result} = renderHook(() => useParcel({
            source: () => ({
                value: 123
            }),
            types
        }));

        expect(types).toHaveBeenCalledTimes(1);
        expect(types.mock.calls[0][0]).toEqual(result.current._treeShare.typeSet.types);
    });
});
