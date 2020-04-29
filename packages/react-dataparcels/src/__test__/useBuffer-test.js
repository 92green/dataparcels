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

    it('should pass new inner parcel if source is different and buffer = false', () => {

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

        expect(result.current.meta.synced).toBe(true);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.push("A");
        });

        expect(result.current.meta.synced).toBe(false);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.push("B");
        });

        expect(result.current.meta.synced).toBe(false);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.meta.submit();
        });

        expect(result.current.meta.synced).toBe(true);
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
        expect(result.current.meta.synced).toBe(true);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.push("A");
        });

        expect(result.current.value).toEqual(["A"]);
        expect(result.current.meta.synced).toBe(false);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current.meta.reset();
        });

        expect(result.current.value).toEqual([]);
        expect(result.current.meta.synced).toBe(true);
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

describe('useBuffer buffer and source combinations', () => {

    it('should reapply buffered actions onto new source', () => {

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

    it('should only reapply buffered actions that can be applied onto new source', () => {

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

    it('should only reapply buffered actions since last submit onto new source', () => {

        let source = new Parcel({
            value: [1]
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source, buffer: true}));

        act(() => {
            result.current.push(2);
            result.current.push(3);
            result.current.meta.submit();
            result.current.push(4);
        });

        act(() => {
            rerender({
                source: new Parcel({
                    value: [10,20,30]
                })
            });
        });

        expect(result.current.value).toEqual([10,20,30,4]);
    });

    it('should replace new source without creating new history items', () => {

        let source = new Parcel({
            value: [1]
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source, buffer: true}));

        expect(result.current.meta._history.length).toBe(1);

        act(() => {
            rerender({
                source: new Parcel({
                    value: [2]
                })
            });

            rerender({
                source: new Parcel({
                    value: [3]
                })
            });
        });

        expect(result.current.meta._history.length).toBe(1);

        act(() => {
            result.current.push(4);
            result.current.push(5);
            result.current.meta.submit();
            result.current.push(6);
        });

        expect(result.current.meta._history.length).toBe(4);

        act(() => {
            rerender({
                source: new Parcel({
                    value: [30,40,50]
                })
            });

            rerender({
                source: new Parcel({
                    value: [300,400,500]
                })
            });
        });

        expect(result.current.meta._history.length).toBe(2); // lower because of obsolete buffer items being removed
        expect(result.current.value).toEqual([300,400,500,6]);
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

describe('useBuffer history', () => {

    it('should push and undo', () => {
        let source = new Parcel({
            value: 100
        });

        let {result} = renderHook(() => useBuffer({source}));

        expect(result.current.value).toBe(100);
        expect(result.current.meta.synced).toBe(true);
        expect(result.current.meta.canUndo).toBe(false);
        expect(result.current.meta.canRedo).toBe(false);
        expect(result.current.meta._history.length).toBe(1);

        act(() => {
            result.current.set(200);
            result.current.set(300);
        });

        expect(result.current.value).toBe(300);
        expect(result.current.meta.synced).toBe(false);
        expect(result.current.meta.canUndo).toBe(true);
        expect(result.current.meta.canRedo).toBe(false);
        expect(result.current.meta._history.length).toBe(3);

        act(() => {
            result.current.meta.undo();
        });

        expect(result.current.value).toBe(200);
        expect(result.current.meta.synced).toBe(false);
        expect(result.current.meta.canUndo).toBe(true);
        expect(result.current.meta.canRedo).toBe(true);
        expect(result.current.meta._history.length).toBe(3);

        act(() => {
            result.current.meta.undo();
            result.current.meta.undo();
            result.current.meta.undo();
        });

        expect(result.current.value).toBe(100);
        expect(result.current.meta.synced).toBe(true);
        expect(result.current.meta.canUndo).toBe(false);
        expect(result.current.meta.canRedo).toBe(true);
        expect(result.current.meta._history.length).toBe(3);
    });

    it('should redo', () => {
        let source = new Parcel({
            value: 100
        });

        let {result} = renderHook(() => useBuffer({source}));

        act(() => {
            result.current.set(200);
            result.current.set(300);
            result.current.meta.undo();
            result.current.meta.undo();
        });

        expect(result.current.value).toBe(100);
        expect(result.current.meta.synced).toBe(true);
        expect(result.current.meta.canUndo).toBe(false);
        expect(result.current.meta.canRedo).toBe(true);
        expect(result.current.meta._history.length).toBe(3);

        act(() => {
            result.current.meta.redo();
        });

        expect(result.current.value).toBe(200);
        expect(result.current.meta.synced).toBe(false);
        expect(result.current.meta.canUndo).toBe(true);
        expect(result.current.meta.canRedo).toBe(true);
        expect(result.current.meta._history.length).toBe(3);

        act(() => {
            result.current.meta.redo();
            result.current.meta.redo();
            result.current.meta.redo();
        });

        expect(result.current.value).toBe(300);
        expect(result.current.meta.synced).toBe(false);
        expect(result.current.meta.canUndo).toBe(true);
        expect(result.current.meta.canRedo).toBe(false);
        expect(result.current.meta._history.length).toBe(3);
    });

    it('should remove "newer" history items when making new changes after undoing', () => {
        let source = new Parcel({
            value: [1]
        });

        let {result} = renderHook(() => useBuffer({source}));

        act(() => {
            result.current.push(2);
            result.current.meta.undo();
        });

        expect(result.current.value).toEqual([1]);
        expect(result.current.meta.canUndo).toBe(false);
        expect(result.current.meta.canRedo).toBe(true);
        expect(result.current.meta._history.length).toBe(2);

        act(() => {
            result.current.push(3);
        });

        expect(result.current.value).toEqual([1,3]);
        expect(result.current.meta.canUndo).toBe(true);
        expect(result.current.meta.canRedo).toBe(false);
        expect(result.current.meta._history.length).toBe(2);
    });

    it('should not be able to undo after submit and receive', () => {
        let source = new Parcel({
            value: 100
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source}));

        act(() => {
            result.current.set(200);
            result.current.set(300);
            result.current.meta.submit();
            rerender({
                source: new Parcel({
                    value: 300
                })
            });
        });

        expect(result.current.value).toBe(300);
        expect(result.current.meta.canUndo).toBe(false);
        expect(result.current.meta._history.length).toBe(1);

        act(() => {
            result.current.meta.undo();
            result.current.meta.undo();
            result.current.meta.undo();
        });

        expect(result.current.value).toBe(300);
    });

    it('should be able to undo, then submit, and still have redos available', () => {
        let source = new Parcel({
            value: ''
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source}));

        act(() => {
            result.current.set('a');
            result.current.set('ab');
            result.current.set('abc');
            result.current.set('abcd');
            result.current.meta.undo();
            result.current.meta.undo();
            result.current.meta.submit();
            rerender({
                source: new Parcel({
                    value: 'ab'
                })
            });
        });

        expect(result.current.value).toBe('ab');
        expect(result.current.meta.canRedo).toBe(true);
        expect(result.current.meta._history.length).toBe(3);

        act(() => {
            result.current.meta.redo();
            result.current.meta.redo();
        });

        expect(result.current.meta.canRedo).toBe(false);
        expect(result.current.value).toBe('abcd');
    });

    it('should be able to undo after submit and receive if history is large enough', () => {
        let handleChange = jest.fn();

        let source = new Parcel({
            value: [100],
            handleChange
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source, history: 100}));

        act(() => {
            result.current.push(200);
            result.current.push(300);
            result.current.push(400);
            result.current.meta.submit();
            rerender({
                source: new Parcel({
                    value: [100,200,300,400],
                    handleChange
                })
            });
        });

        expect(result.current.value).toEqual([100,200,300,400]);
        expect(result.current.meta.canUndo).toBe(true);
        expect(result.current.meta._history.length).toBe(4);

        act(() => {
            result.current.meta.undo();
            result.current.meta.undo();
        });

        expect(result.current.value).toEqual([100,200]);

        act(() => {
            result.current.meta.submit();
        });

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][0].value).toEqual([100,200]);
    });

    it('should be able to undo after submit, then redo and submit if history is large enough', () => {
        let handleChange = jest.fn();

        let source = new Parcel({
            value: [100],
            handleChange
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source, history: 100}));

        act(() => {
            result.current.push(200);
            result.current.push(300);
            result.current.push(400);
            result.current.meta.submit();
            rerender({
                source: new Parcel({
                    value: [100,200,300,400],
                    handleChange
                })
            });
        });

        expect(result.current.value).toEqual([100,200,300,400]);
        expect(result.current.meta.canUndo).toBe(true);
        expect(result.current.meta._history.length).toBe(4);

        act(() => {
            result.current.meta.undo();
        });

        expect(result.current.value).toEqual([100,200,300]);

        act(() => {
            result.current.meta.submit();
            rerender({
                source: new Parcel({
                    value: [100,200,300],
                    handleChange
                })
            });
        });

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][0].value).toEqual([100,200,300]);
        expect(handleChange.mock.calls[1][1]._actions[0].type).toBe('setData');

        // if another submit occurs, right now it is also a setdata
        // ideally this should be fixed but right noe poses no problems
    });

    it('should be able to undo and redo after submit, if history is large enough', () => {
        let handleChange = jest.fn();

        let source = new Parcel({
            value: [100],
            handleChange
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source, history: 100}));

        act(() => {
            result.current.push(200);
            result.current.push(300);
            result.current.push(400);
            result.current.meta.submit();
            rerender({
                source: new Parcel({
                    value: [100,200,300,400],
                    handleChange
                })
            });
        });

        expect(result.current.value).toEqual([100,200,300,400]);
        expect(result.current.meta.synced).toBe(true);
        expect(result.current.meta.canUndo).toBe(true);
        expect(result.current.meta._history.length).toBe(4);

        act(() => {
            result.current.meta.undo();
        });

        act(() => {
            result.current.push(777);
        });

        expect(result.current.value).toEqual([100,200,300,777]);
        expect(result.current.meta._history.length).toBe(4);
        expect(result.current.meta.synced).toBe(false);

        act(() => {
            result.current.meta.submit();
            rerender({
                source: new Parcel({
                    value: [100,200,300,777],
                    handleChange
                })
            });
        });

        expect(handleChange).toHaveBeenCalledTimes(2);
        expect(handleChange.mock.calls[1][0].value).toEqual([100,200,300,777]);
        expect(handleChange.mock.calls[1][1]._actions[0].type).toBe('setData');

        act(() => {
            result.current.push(444);
            result.current.meta.submit();
            rerender({
                source: new Parcel({
                    value: [100,200,300,777,444],
                    handleChange
                })
            });
        });
        expect(handleChange).toHaveBeenCalledTimes(3);
        expect(handleChange.mock.calls[2][0].value).toEqual([100,200,300,777,444]);
        expect(handleChange.mock.calls[2][1]._actions[0].type).not.toBe('setData');
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
