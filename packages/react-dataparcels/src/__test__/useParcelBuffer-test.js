// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelBuffer from '../useParcelBuffer';
import Parcel from 'dataparcels';

jest.useFakeTimers();

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

describe('useParcelBuffer should use config.parcel', () => {

    it('should pass through a parcels data', () => {
        let parcel = new Parcel();

        let {result} = renderHook(() => useParcelBuffer({parcel}));

        expect(result.current[0].data).toEqual(parcel.data);
    });

    it('should propagate parcel change immediately', () => {
        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({parcel}));

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

    it('should pass new inner parcel if outer parcel is different', () => {

        let parcel = new Parcel({
            value: 123
        });

        let {result, rerender} = renderHookWithProps({parcel}, ({parcel}) => useParcelBuffer({parcel}));

        act(() => {
            rerender({
                parcel: new Parcel({
                    value: 456
                })
            });
        });

        expect(result.current[0].value).toEqual(456);
    });

    it('should not use the same registry between outer and inner parcels', () => {

        // sharing a registry could feasibly enable unrelease changes in one buffer
        // to be leaked outside of that buffer during a change

        let parcel = new Parcel();
        let {result} = renderHook(() => useParcelBuffer({parcel}));

        expect(result.current[0]._registry).not.toBe(parcel._registry);
    });

});

describe('useParcelBuffer should pass ParcelBoundaryControl', () => {

    it('should pass ParcelBoundaryControl as second element in returned array', () => {
        let parcel = new Parcel();

        let {result} = renderHook(() => useParcelBuffer({parcel}));

        expect(typeof result.current[1].clear).toBe("function");
        expect(typeof result.current[1].release).toBe("function");
        expect(result.current[1].buffered).toBe(false);
        expect(result.current[1].actions).toEqual([]);
    });

});

describe('useParcelBuffer should use config.hold', () => {

    it('should hold changes', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            hold: true
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(handleChange).not.toHaveBeenCalled();
    });

    it('should release changes', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            hold: true
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
            result.current[1].release();
        });

        expect(result.current[1].buffered).toBe(false);
        expect(result.current[1].actions.length).toBe(0);
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toEqual(["A", "B"]);
    });

    it('should try to release changes but do nothing if there are no changes', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            hold: true
        }));

        act(() => {
            result.current[1].release();
        });

        expect(handleChange).not.toHaveBeenCalled();
    });

    it('should clear changes', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            hold: true
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
            result.current[1].clear();
        });

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
        expect(handleChange.mock.calls[1][0].value).toEqual(["A", "B", "C"]);
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

describe('useParcelBuffer should use config.modifyBeforeUpdate', () => {

    it('should apply single modifyBeforeUpdate to outer parcel', () => {

        let parcel = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            modifyBeforeUpdate: value => value * 2
        }));

        expect(result.current[0].value).toBe(246);
    });

    it('should apply multiple modifyBeforeUpdate to outer parcel', () => {
        let parcel = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            modifyBeforeUpdate: [
                value => value * 2,
                value => value + 5
            ]
        }));

        expect(result.current[0].value).toBe(251);
    });

    it('should apply single modifyBeforeUpdate to inner parcel', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 0,
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            modifyBeforeUpdate: value => value * 2
        }));

        act(() => {
            result.current[0].set(123);
        });

        expect(handleChange.mock.calls[0][0].value).toBe(246);
    });

    it('should apply multiple modifyBeforeUpdate to inner parcel', () => {

        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 0,
            handleChange
        });

        let {result} = renderHook(() => useParcelBuffer({
            parcel,
            modifyBeforeUpdate: [
                value => value * 2,
                value => value + 5
            ]
        }));

        act(() => {
            result.current[0].set(123);
        });

        expect(handleChange.mock.calls[0][0].value).toBe(251);
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