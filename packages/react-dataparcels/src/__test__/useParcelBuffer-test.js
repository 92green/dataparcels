// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelBuffer from '../useParcelBuffer';
import Parcel from 'dataparcels';

jest.useFakeTimers();

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

describe('useParcelBuffer should use config.parcel', () => {

    it('should pass through a parcels data with buffer meta', () => {
        let parcel = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useParcelBuffer({parcel}));

        expect(result.current[0].data).toEqual({
            value: 123,
            child: undefined,
            key: '^',
            meta: {
                _reset: false,
                _submit: false
            }
        });
    });

    it('should pass through a parcel on first hook call', () => {
        let parcel = new Parcel();
        let hookRenderer = jest.fn(() => useParcelBuffer({parcel}));

        renderHook(hookRenderer);
        expect(hookRenderer.mock.results[0].value[0] instanceof Parcel).toBe(true);
    });

    it('should propagate parcel change immediately when buffer = false', () => {
        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({parcel, buffer: false}));

        act(() => {
            result.current[0].set(456);
        });

        expect(handleChange.mock.calls[0][0].value).toBe(456);
    });

    it('should pass same inner parcel if outer parcel is the same', () => {

        let parcel = new Parcel({
            value: 123
        });

        let {result, rerender} = renderHookWithProps({parcel}, ({parcel}) => useParcelBuffer({parcel}));

        let firstResult = result.current[0];

        act(() => {
            rerender({
                parcel
            });
        });

        expect(result.current[0]).toBe(firstResult);
    });

    it('should pass new inner parcel and clear buffer contents if outer parcel is different', () => {

        let parcel = new Parcel({
            value: 123
        });

        let {result, rerender} = renderHookWithProps({parcel}, ({parcel}) => useParcelBuffer({parcel}));

        act(() => {
            result.current[0].set(124);
        });

        act(() => {
            rerender({
                parcel: new Parcel({
                    value: 456
                })
            });
        });

        // inner parcel should have outer parcels value
        expect(result.current[0].value).toEqual(456);
        // buffer should be cleared
        expect(result.current[1].actions.length).toBe(0);
    });

    it('should keep inner parcel and buffer contents if outer parcel is different and frameMeta has rebase = true', () => {

        let parcel = new Parcel({
            value: {
                abc: 100,
                def: 100
            }
        });

        let {result, rerender} = renderHookWithProps({parcel}, ({parcel}) => useParcelBuffer({parcel}));

        act(() => {
            result.current[0].set('abc', 400);
        });

        // confirm that set() has worked
        expect(result.current[0].value).toEqual({
            abc: 400,
            def: 100
        });

        act(() => {
            let parcel = new Parcel({
                value: {
                    abc: 200,
                    def: 200
                }
            });

            parcel._frameMeta.rebase = true;

            rerender({
                parcel
            });
        });

        // actions should be rebased onto new parcel from props
        // and inner parcel should contain the resulting data
        expect(result.current[0].value).toEqual({
            abc: 400,
            def: 200
        });

        // buffer should remain
        expect(result.current[1].actions.length).toBe(1);
    });

});

describe('useParcelBuffer should pass ParcelBoundaryControl', () => {

    it('should pass ParcelBoundaryControl as second element in returned array', () => {
        let parcel = new Parcel();

        let {result} = renderHook(() => useParcelBuffer({parcel}));

        expect(typeof result.current[1].reset).toBe("function");
        expect(typeof result.current[1].submit).toBe("function");
        expect(result.current[1].buffered).toBe(false);
        expect(result.current[1].actions).toEqual([]);
    });

});

describe('useParcelBuffer should use buffer by default', () => {

    it('should hold changes', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(handleChange).not.toHaveBeenCalled();
    });

    it('should submit changes', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel
        }));

        expect(result.current[1].buffered).toBe(false);
        expect(result.current[1].actions.length).toBe(0);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current[0].push("A");
        });

        expect(result.current[1].buffered).toBe(true);
        expect(result.current[1].actions.length).toBe(1);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current[0].push("B");
        });

        expect(result.current[1].buffered).toBe(true);
        expect(result.current[1].actions.length).toBe(2);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current[1].submit();
        });

        expect(result.current[1].buffered).toBe(false);
        expect(result.current[1].actions.length).toBe(0);
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toEqual(["A", "B"]);
    });

    it('should submit empty change request if there are no changes', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel
        }));

        act(() => {
            result.current[1].submit();
        });

        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][1].actions.length).toBe(0);
    });

    it('should reset changes', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel
        }));

        expect(result.current[0].value).toEqual([]);
        expect(result.current[1].buffered).toBe(false);
        expect(result.current[1].actions.length).toBe(0);
        expect(handleChange).toHaveBeenCalledTimes(0);
        act(() => {
            result.current[0].push("A");
        });

        expect(result.current[0].value).toEqual(["A"]);
        expect(result.current[1].buffered).toBe(true);
        expect(result.current[1].actions.length).toBe(1);
        expect(handleChange).toHaveBeenCalledTimes(0);

        act(() => {
            result.current[1].reset();
        });

        expect(result.current[0].value).toEqual([]);
        expect(result.current[1].buffered).toBe(false);
        expect(result.current[1].actions.length).toBe(0);
        expect(handleChange).toHaveBeenCalledTimes(0);
    });

});

describe('useParcelBuffer should use config.debounce', () => {

    it('should propagate parcel change after debounce ms have elapsed between changes', () => {
        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            debounce: 20
        }));

        act(() => {
            result.current[0].push("A");
        });

        act(() => {
            jest.advanceTimersByTime(10);
        });

        act(() => {
            result.current[0].push("B");
        });

        act(() => {
            jest.advanceTimersByTime(40);
        });

        act(() => {
            result.current[0].push("C");
        });

        act(() => {
            jest.advanceTimersByTime(40);
        });

        expect(handleChange.mock.calls[0][0].value).toEqual(["A", "B"]);
        expect(handleChange.mock.calls[1][0].value).toEqual(["C"]);
    });

    it('should debounce even when buffer = false', () => {
        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            debounce: 20,
            buffer: false
        }));

        act(() => {
            result.current[0].push("A");
        });

        act(() => {
            jest.advanceTimersByTime(10);
        });

        act(() => {
            result.current[0].push("B");
        });

        act(() => {
            jest.advanceTimersByTime(40);
        });

        act(() => {
            result.current[0].push("C");
        });

        act(() => {
            jest.advanceTimersByTime(40);
        });

        expect(handleChange.mock.calls[0][0].value).toEqual(["A", "B"]);
        expect(handleChange.mock.calls[1][0].value).toEqual(["C"]);
    });

    it('should flush debounced changes if config.debounce is removed', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result, rerender} = renderHookWithProps({debounce: 200}, ({debounce}) => useParcelBuffer({
            parcel,
            debounce
        }));

        act(() => {
            result.current[0].set(456);
        });

        act(() => {
            jest.advanceTimersByTime(10);
        });

        expect(handleChange).not.toHaveBeenCalled();

        act(() => {
            rerender({
                debounce: 0
            });
        });

        expect(handleChange.mock.calls[0][0].value).toBe(456);
    });
});

describe('useParcelBuffer should use config.beforeChange', () => {

    it('should apply single beforeChange to outer parcel', () => {

        let parcel = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            beforeChange: value => value * 2,
            buffer: false
        }));

        expect(result.current[0].value).toBe(246);
    });

    it('should apply multiple beforeChange to outer parcel', () => {
        let parcel = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            beforeChange: [
                value => value * 2,
                value => value + 5
            ],
            buffer: false
        }));

        expect(result.current[0].value).toBe(251);
    });

    it('should apply single beforeChange to inner parcel', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 0,
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            beforeChange: value => value * 2,
            buffer: false
        }));

        act(() => {
            result.current[0].set(123);
        });

        expect(handleChange.mock.calls[0][0].value).toBe(246);
    });

    it('should apply multiple beforeChange to inner parcel', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 0,
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            beforeChange: [
                value => value * 2,
                value => value + 5
            ],
            buffer: false
        }));

        act(() => {
            result.current[0].set(123);
        });

        expect(handleChange.mock.calls[0][0].value).toBe(251);
    });

    it('should apply single beforeChange to outer parcel after an update', () => {

        let parcel = new Parcel({
            value: 123
        });

        let {result, rerender} = renderHook(() => useParcelBuffer({
            parcel,
            beforeChange: value => value * 2
        }));

        act(() => {
            result.current[0].set(100);
            rerender();
        });

        expect(result.current[0].value).toBe(200);
    });

});

describe('useParcelBuffer should use config.keepValue', () => {

    it('should keep value if change originated from self and different value is passed down', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: {
                abc: 100
            },
            handleChange
        });

        let {result, rerender} = renderHookWithProps({parcel}, ({parcel}) => useParcelBuffer({
            keepValue: true,
            buffer: false,
            parcel: parcel
                .get('abc')
                .modifyDown(value => `${value}`)
                .modifyUp(value => Number(value))
        }));

        expect(result.current[0].value).toBe("100");

        act(() => {
            result.current[0].set("100!");
        });

        let newParcel = handleChange.mock.calls[0][0];
        newParcel._frameMeta = {
            lastOriginId: handleChange.mock.calls[0][1].originId
        };

        expect(newParcel.value).toEqual({
            abc: NaN
        });

        act(() => {
            rerender({
                parcel: newParcel
            });
        });

        expect(result.current[0].value).toBe("100!");
    });

});
