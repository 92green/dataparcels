// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelSideEffect from '../useParcelSideEffect';
import Parcel from 'dataparcels';

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

const onChangePromise = (onChange, index = 0) => onChange.mock.results[index].value.catch(() => {});

describe('useParcelSideEffect should use config.parcel', () => {

    it('should pass through a parcels data', () => {
        let parcel = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useParcelSideEffect({parcel}));

        expect(result.current[0].data).toEqual({
            value: 123,
            child: undefined,
            key: '^',
            meta: {}
        });
    });

    it('should pass through a parcel on first hook call', () => {
        let parcel = new Parcel();
        let hookRenderer = jest.fn(() => useParcelSideEffect({parcel}));

        renderHook(hookRenderer);
        expect(hookRenderer.mock.results[0].value[0] instanceof Parcel).toBe(true);
    });

    it('should propagate parcel change immediately', () => {
        let handleChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({parcel, buffer: false}));

        act(() => {
            result.current[0].set(456);
        });

        expect(handleChange.mock.calls[0][0].value).toBe(456);
    });

    it('should pass same inner parcel if outer parcel is the same', () => {

        let parcel = new Parcel({
            value: 123
        });

        let {result, rerender} = renderHookWithProps({parcel}, ({parcel}) => useParcelSideEffect({parcel}));

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

        let {result, rerender} = renderHookWithProps({parcel}, ({parcel}) => useParcelSideEffect({parcel}));

        act(() => {
            rerender({
                parcel: new Parcel({
                    value: 456
                })
            });
        });

        expect(result.current[0].value).toEqual(456);
    });

});

describe('useParcelSideEffect should use config.onChange', () => {

    it('should call onChange with value and change request if provided', () => {
        let handleChange = jest.fn();
        let onChange = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onChange
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toBe(456);
        expect(onChange.mock.calls[0][1].prevData.value).toBe(123);
        expect(handleChange.mock.calls[0][0].value).toBe(456);
    });

    it('should call onChange with result if onChangeUseResult = true', () => {
        let handleChange = jest.fn();
        let onChange = jest.fn(() => 333);

        let parcel = new Parcel({
            value: [123],
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onChange,
            onChangeUseResult: true
        }));

        act(() => {
            result.current[0].get(0).set(456);
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toEqual([456]);
        expect(onChange.mock.calls[0][1].prevData.value).toEqual([123]);
        expect(handleChange.mock.calls[0][0].value).toEqual(333);
        expect(handleChange.mock.calls[0][1].originId).toBe(onChange.mock.calls[0][1].originId);
    });

});


describe('useParcelSideEffect should use config.onChange with promises', () => {

    it('should call onChange with promise that resolves', async () => {
        let handleChange = jest.fn();
        let onChange = jest.fn(() => Promise.resolve(333));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onChange
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toBe(456);
        expect(onChange.mock.calls[0][1].prevData.value).toBe(123);
        expect(handleChange).toHaveBeenCalledTimes(0);

        await onChangePromise(onChange);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toBe(456);
    });

    it('should not call onChange with promise that rejects', async () => {
        let handleChange = jest.fn();
        let onChange = jest.fn(() => Promise.reject('error'));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onChange
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toBe(456);
        expect(onChange.mock.calls[0][1].prevData.value).toBe(123);

        expect(handleChange).toHaveBeenCalledTimes(0);

        await onChangePromise(onChange);

        expect(handleChange).toHaveBeenCalledTimes(0);
        // test for revert...
    });

    it('should call onChange with promise that resolves with result if onChangeUseResult = true', async () => {
        let handleChange = jest.fn();
        let onChange = jest.fn(() => Promise.resolve(333));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onChange,
            onChangeUseResult: true
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toBe(456);
        expect(onChange.mock.calls[0][1].prevData.value).toBe(123);
        expect(handleChange).toHaveBeenCalledTimes(0);

        await onChangePromise(onChange);

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toBe(333);
    });

    it('should merge subsequent onChange if promise resolves twice', async () => {
        let handleChange = jest.fn();
        let onChange = jest.fn();
        onChange
            .mockReturnValueOnce(Promise.resolve())
            .mockReturnValueOnce(Promise.resolve());

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onChange
        }));

        act(() => {
            result.current[0].push(123);
            result.current[0].push(456);
        });

        // only process one change at a time...
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toEqual([123]);
        expect(onChange.mock.calls[0][1].prevData.value).toEqual([]);

        // wait until the first promise is complete before firing off anything
        expect(handleChange).toHaveBeenCalledTimes(0);

        await onChangePromise(onChange);

        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChange.mock.calls[1][0].value).toEqual([123, 456]);
        expect(onChange.mock.calls[1][1].prevData.value).toEqual([]);
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toEqual([123, 456]);
    });

    it('should merge subsequent onChange if promise rejects and then resolves', async () => {
        let handleChange = jest.fn();
        let onChange = jest.fn();
        onChange
            .mockReturnValueOnce(Promise.reject())
            .mockReturnValueOnce(Promise.resolve());

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onChange
        }));

        act(() => {
            result.current[0].push(123);
            result.current[0].push(456);
        });

        // only process one change at a time...
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toEqual([123]);
        expect(onChange.mock.calls[0][1].prevData.value).toEqual([]);

        // wait until the first promise is complete before firing off anything
        expect(handleChange).toHaveBeenCalledTimes(0);

        await onChangePromise(onChange);

        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChange.mock.calls[1][0].value).toEqual([123, 456]);
        expect(onChange.mock.calls[1][1].prevData.value).toEqual([]);
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toEqual([123, 456]);
    });

});
