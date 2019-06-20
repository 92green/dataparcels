// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelSideEffect from '../useParcelSideEffect';
import Parcel from 'dataparcels';

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

const onSubmitPromise = (onSubmit, index = 0) => onSubmit.mock.results[index].value.catch(() => {});

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

describe('useParcelSideEffect should use config.onSubmit', () => {

    it('should call onSubmit with value and change request if provided', () => {
        let handleChange = jest.fn();
        let onSubmit = jest.fn();

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onSubmit
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0].value).toBe(456);
        expect(onSubmit.mock.calls[0][1].prevData.value).toBe(123);
        expect(handleChange.mock.calls[0][0].value).toBe(456);
    });

    it('should call onSubmit with result if onSubmitUseResult = true', () => {
        let handleChange = jest.fn();
        let onSubmit = jest.fn(() => 333);

        let parcel = new Parcel({
            value: [123],
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onSubmit,
            onSubmitUseResult: true
        }));

        act(() => {
            result.current[0].get(0).set(456);
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0].value).toEqual([456]);
        expect(onSubmit.mock.calls[0][1].prevData.value).toEqual([123]);
        expect(handleChange.mock.calls[0][0].value).toEqual(333);
        expect(handleChange.mock.calls[0][1].originId).toBe(onSubmit.mock.calls[0][1].originId);
    });

});


describe('useParcelSideEffect should use config.onSubmit with promises', () => {

    it('should default to a default submitStatus', async () => {

        let handleChange = jest.fn();
        let onSubmit = jest.fn(() => Promise.resolve(333));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onSubmit
        }));

        expect(result.current[1]).toEqual({
            submitStatus: {
                status: 'idle',
                isPending: false,
                isResolved: false,
                isRejected: false,
                error: undefined
            }
        });

    });


    it('should call onSubmit with promise that resolves', async () => {
        let handleChange = jest.fn();
        let onSubmit = jest.fn(() => Promise.resolve(333));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onSubmit
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0].value).toBe(456);
        expect(onSubmit.mock.calls[0][1].prevData.value).toBe(123);
        expect(handleChange).toHaveBeenCalledTimes(0);

        await act(async () => {
            await onSubmitPromise(onSubmit);
        });

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toBe(456);
    });

    it('should set status correctly with promise that resolves', async () => {
        let onSubmit = jest.fn(() => Promise.resolve(333));

        let parcel = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onSubmit
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(result.current[1]).toEqual({
            submitStatus: {
                status: 'pending',
                isPending: true,
                isResolved: false,
                isRejected: false,
                error: undefined
            }
        });

        await act(async () => {
            await onSubmitPromise(onSubmit);
        });

        expect(result.current[1]).toEqual({
            submitStatus: {
                status: 'resolved',
                isPending: false,
                isResolved: true,
                isRejected: false,
                error: undefined
            }
        });
    });

    it('should not call onSubmit with promise that rejects', async () => {
        let handleChange = jest.fn();
        let onSubmit = jest.fn(() => Promise.reject('error message!'));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onSubmit
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0].value).toBe(456);
        expect(onSubmit.mock.calls[0][1].prevData.value).toBe(123);
        expect(handleChange).toHaveBeenCalledTimes(0);

        await act(async () => {
            await onSubmitPromise(onSubmit);
        });

        expect(handleChange).toHaveBeenCalledTimes(0);
        // test for revert...
    });

    it('should set status correctly with promise that rejects', async () => {
        let onSubmit = jest.fn(() => Promise.reject('error message!'));

        let parcel = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onSubmit
        }));

        act(() => {
            result.current[0].set(456);
        });

        await act(async () => {
            await onSubmitPromise(onSubmit);
        });

        expect(result.current[1]).toEqual({
            submitStatus: {
                status: 'rejected',
                isPending: false,
                isResolved: false,
                isRejected: true,
                error: 'error message!'
            }
        });
    });

    it('should call onSubmit with promise that resolves with result if onSubmitUseResult = true', async () => {
        let handleChange = jest.fn();
        let onSubmit = jest.fn(() => Promise.resolve(333));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onSubmit,
            onSubmitUseResult: true
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0].value).toBe(456);
        expect(onSubmit.mock.calls[0][1].prevData.value).toBe(123);
        expect(handleChange).toHaveBeenCalledTimes(0);

        await act(async () => {
            await onSubmitPromise(onSubmit);
        });

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toBe(333);
    });

    it('should merge subsequent onSubmit if promise resolves twice', async () => {
        let handleChange = jest.fn();
        let onSubmit = jest.fn();
        onSubmit
            .mockReturnValueOnce(Promise.resolve())
            .mockReturnValueOnce(Promise.resolve());

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onSubmit
        }));

        act(() => {
            result.current[0].push(123);
            result.current[0].push(456);
        });

        // only process one change at a time...
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0].value).toEqual([123]);
        expect(onSubmit.mock.calls[0][1].prevData.value).toEqual([]);

        // wait until the first promise is complete before firing off anything
        expect(handleChange).toHaveBeenCalledTimes(0);

        await act(async () => {
            await onSubmitPromise(onSubmit);
        });

        expect(onSubmit).toHaveBeenCalledTimes(2);
        expect(onSubmit.mock.calls[1][0].value).toEqual([123, 456]);
        expect(onSubmit.mock.calls[1][1].prevData.value).toEqual([]);
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toEqual([123, 456]);
    });

    it('should merge subsequent onSubmit if promise rejects and then resolves', async () => {
        let handleChange = jest.fn();
        let onSubmit = jest.fn();
        onSubmit
            .mockReturnValueOnce(Promise.reject())
            .mockReturnValueOnce(Promise.resolve());

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffect({
            parcel,
            onSubmit
        }));

        act(() => {
            result.current[0].push(123);
            result.current[0].push(456);
        });

        // only process one change at a time...
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(onSubmit.mock.calls[0][0].value).toEqual([123]);
        expect(onSubmit.mock.calls[0][1].prevData.value).toEqual([]);

        // wait until the first promise is complete before firing off anything
        expect(handleChange).toHaveBeenCalledTimes(0);

        await act(async () => {
            await onSubmitPromise(onSubmit);
        });

        expect(onSubmit).toHaveBeenCalledTimes(2);
        expect(onSubmit.mock.calls[1][0].value).toEqual([123, 456]);
        expect(onSubmit.mock.calls[1][1].prevData.value).toEqual([]);
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toEqual([123, 456]);
    });
});
