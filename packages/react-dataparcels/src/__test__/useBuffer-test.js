// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useBuffer from '../useBuffer';
import {parcelEqual} from '../useBuffer';
import Parcel from 'dataparcels';

jest.useFakeTimers();

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

describe('useBuffer source', () => {

    it('should pass through a parcels data', () => {
        let source = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useBuffer({source}));

        expect(result.current.value).toEqual(source.value);
    });

    it('should pass through a parcel on first hook call', () => {
        let source = new Parcel();
        let hookRenderer = jest.fn(() => useBuffer({source}));

        renderHook(hookRenderer);
        expect(hookRenderer.mock.results[0].value instanceof Parcel).toBe(true);
    });

    it('should propagate parcel change immediately (if buffer = false)', () => {
        let handleChange = jest.fn();

        let source = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useBuffer({source, buffer: false}));

        act(() => {
            result.current.set(456);
        });

        expect(handleChange.mock.calls[0][0].value).toBe(456);
    });

    it('should pass same inner parcel if source is the same', () => {

        let source = new Parcel({
            value: 123
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source, buffer: false}));

        let firstResult = result.current;

        act(() => {
            rerender({
                source
            });
        });

        expect(result.current).toBe(firstResult);
    });

    it('should pass new inner parcel if source is different', () => {

        let source = new Parcel({
            value: 123
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source, buffer: false}));

        act(() => {
            result.current.set(124);
        });

        act(() => {
            rerender({
                source: new Parcel({
                    value: 456
                })
            });
        });

        // inner parcel should have sources value
        expect(result.current.value).toEqual(456);
    });

    it('should pass new inner parcel if source is different, and reapply buffered actions', () => {

        let source = new Parcel({
            value: [1]
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source, buffer: true}));

        act(() => {
            result.current.push(2);
            result.current.push(3);
        });

        act(() => {
            rerender({
                source: new Parcel({
                    value: [0]
                })
            });
        });

        expect(result.current.value).toEqual([0,2,3]);
    });

    it('should pass new inner parcel if source is different, and only reapply buffered actions that can be applied', () => {

        let source = new Parcel({
            value: [[],[]]
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source, buffer: true}));

        act(() => {
            result.current.get(0).push(0);
            result.current.get(1).push(1);
        });

        expect(result.current.value).toEqual([[0],[1]]);

        act(() => {
            rerender({
                source: new Parcel({
                    value: [null, []]
                })
            });
        });

        expect(result.current.value).toEqual([null,[1]]);
    });
});

describe('useBuffer buffer', () => {

    it('should buffer changes by default', () => {

        let handleChange = jest.fn();

        let source = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useBuffer({source}));

        act(() => {
            result.current.set(456);
        });

        expect(handleChange).not.toHaveBeenCalled();
    });

    it('should submit changes', () => {

        let handleChange = jest.fn();

        let source = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useBuffer({source}));

        expect(result.current.meta.canSubmit).toBe(false);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.push("A");
        });

        expect(result.current.meta.canSubmit).toBe(true);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.push("B");
        });

        expect(result.current.meta.canSubmit).toBe(true);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.meta.submit();
        });

        expect(result.current.meta.canSubmit).toBe(false);
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toEqual(["A", "B"]);
    });

    it('should submit empty change request if there are no changes', () => {

        let handleChange = jest.fn();

        let source = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useBuffer({source}));

        act(() => {
            result.current.meta.submit();
        });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1].actions.length).toBe(0);
    });

    it('should reset changes', () => {

        let handleChange = jest.fn();

        let source = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useBuffer({source}));

        expect(result.current.value).toEqual([]);
        expect(result.current.meta.canSubmit).toBe(false);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.push("A");
        });

        expect(result.current.value).toEqual(["A"]);
        expect(result.current.meta.canSubmit).toBe(true);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.meta.reset();
        });

        expect(result.current.value).toEqual([]);
        expect(result.current.meta.canSubmit).toBe(false);
        expect(handleChange).toHaveBeenCalledTimes(0);
    });

    it('should debounce', () => {
        let handleChange = jest.fn();

        let source = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useBuffer({source, buffer: 20}));

        act(() => {
            result.current.push("A");
        });

        act(() => {
            jest.advanceTimersByTime(10);
        });

        act(() => {
            result.current.push("B");
        });

        act(() => {
            jest.advanceTimersByTime(40);
        });

        act(() => {
            result.current.push("C");
        });

        act(() => {
            jest.advanceTimersByTime(40);
        });

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[0][0].value).toEqual(["A", "B"]);
        expect(handleChange.mock.calls[1][0].value).toEqual(["C"]);
    });

    it('should submit changes as single change request', () => {

        let handleChange = jest.fn();
        let up = jest.fn();

        let source = new Parcel({
            value: [],
            handleChange
        }).modifyUp(up)

        let {result} = renderHook(() => useBuffer({source}));

        act(() => {
            result.current.push("A");
            result.current.push("B");
            result.current.meta.submit();
        });

        expect(up).toHaveBeenCalledTimes(1);
        expect(up.mock.calls[0][0].value).toEqual(["A", "B"]);
        expect(up.mock.calls[0][0].changeRequest.prevData.value).toEqual([]);
        expect(up.mock.calls[0][0].changeRequest.nextData.value).toEqual(["A", "B"]);
    });
});

describe('useBuffer derive', () => {

    it('should derive from above', () => {
        let source = new Parcel({
            value: 100
        });

        let derive = ({value}) => ({value: value * 2});

        let {result} = renderHook(() => useBuffer({source, derive}));

        expect(result.current.value).toBe(200);
    });

    it('should derive from below', () => {
        let handleChange = jest.fn();

        let source = new Parcel({
            value: 100,
            handleChange
        });

        let derive = ({value}) => ({value: value * 2});

        let {result} = renderHook(() => useBuffer({source, derive}));

        act(() => {
            result.current.set(200);
        });

        expect(result.current.value).toBe(400);
    });

    it('should derive from below and pass changes up', () => {
        let handleChange = jest.fn();

        let source = new Parcel({
            value: 100,
            handleChange
        });

        let derive = ({value}) => ({value: value * 2});

        let {result} = renderHook(() => useBuffer({source, buffer: false, derive}));

        act(() => {
            result.current.set(200);
        });

        expect(handleChange.mock.calls[0][0].value).toBe(400);
    });

});

describe('parcel equals', () => {
    it('should test equality to see if a re-render should occur', () => {
        var child = {};
        var parcelCreator = (merge = {}) => {
            let p = new Parcel();
            // $FlowFixMe
            p._parcelData = {
                value: 123,
                meta: {
                    abc: 123,
                    def: 456
                },
                key: "a",
                child,
                ...merge
            };
            return p;
        };

        expect(parcelEqual(parcelCreator(), parcelCreator())).toBe(true);
        expect(parcelEqual(parcelCreator(), parcelCreator({value: 456}))).toBe(false);
        expect(parcelEqual(parcelCreator(), parcelCreator({meta: {abc: 123}}))).toBe(false);
        expect(parcelEqual(parcelCreator(), parcelCreator({child: {}}))).toBe(false);
        expect(parcelEqual(parcelCreator(), parcelCreator({key: "b"}))).toBe(false);
    });

    it('should return false if isFirst or isLast change', () => {
        var child = {};

        let p2 = new Parcel({
            value: [123,456]
        });

        let p = new Parcel({
            value: [123,456],
            handleChange: (newParcel) => {
                p2 = newParcel;
            }
        });

        p.push(789);

        // #a should be true as it hasnt changed value and is still first and not last
        expect(parcelEqual(p.get("#a"), p2.get("#a"))).toBe(true);
        // #b should be false as it used to be last but now isnt (value and meta are the same)
        expect(parcelEqual(p.get("#b"), p2.get("#b"))).toBe(false);

        p.unshift(101112);
        // #a should be false as it used to be first but now isnt (value and meta are the same)
        expect(parcelEqual(p.get("#a"), p2.get("#a"))).toBe(false);
    });
});
