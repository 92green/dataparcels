// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelSideEffectAsync from '../useParcelSideEffectAsync';
import Parcel from 'dataparcels';

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

const onSideEffectPromise = (onSideEffect, index = 0) => onSideEffect.mock.results[index].value.catch(() => {});

const onSideEffect = () => Promise.resolve();

describe('useParcelSideEffectAsync should use config.parcel', () => {

    it('should pass through a parcels data', () => {
        let parcel = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: false
        }));

        expect(result.current[0].data).toEqual({
            value: 123,
            child: undefined,
            key: '^',
            meta: {}
        });
    });

    it('should pass through a parcel on first hook call', () => {
        let parcel = new Parcel();
        let hookRenderer = jest.fn(() => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: false
        }));

        renderHook(hookRenderer);
        expect(hookRenderer.mock.results[0].value[0] instanceof Parcel).toBe(true);
    });

    it('should pass same inner parcel if outer parcel is the same', () => {

        let parcel = new Parcel({
            value: 123
        });

        let {result, rerender} = renderHookWithProps({parcel}, ({parcel}) => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: false
        }));

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

        let {result, rerender} = renderHookWithProps({parcel}, ({parcel}) => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: false
        }));

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

describe('useParcelSideEffectAsync should use config.onSideEffect with promises', () => {

    it('should default to a default submitStatus', async () => {

        let handleChange = jest.fn();
        let onSideEffect = jest.fn(() => Promise.resolve(333));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: false
        }));

        expect(result.current[1]).toEqual({
            status: 'idle',
            isPending: false,
            isResolved: false,
            isRejected: false,
            error: undefined
        });

    });


    it('should call onSideEffect with promise that resolves', async () => {
        let handleChange = jest.fn();
        let onSideEffect = jest.fn(() => Promise.resolve(333));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: false
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onSideEffect).toHaveBeenCalledTimes(1);
        expect(onSideEffect.mock.calls[0][0].value).toBe(456);
        expect(onSideEffect.mock.calls[0][1].prevData.value).toBe(123);
        expect(handleChange).toHaveBeenCalledTimes(0);

        await act(async () => {
            await onSideEffectPromise(onSideEffect);
        });

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toBe(456);
    });

    it('should set status correctly with promise that resolves', async () => {
        let onSideEffect = jest.fn(() => Promise.resolve(333));

        let parcel = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: false
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(result.current[1]).toEqual({
            status: 'pending',
            isPending: true,
            isResolved: false,
            isRejected: false,
            error: undefined
        });

        await act(async () => {
            await onSideEffectPromise(onSideEffect);
        });

        expect(result.current[1]).toEqual({
            status: 'resolved',
            isPending: false,
            isResolved: true,
            isRejected: false,
            error: undefined
        });
    });

    it('should not call onSideEffect with promise that rejects', async () => {
        let handleChange = jest.fn();
        let onSideEffect = jest.fn(() => Promise.reject('error message!'));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: false
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onSideEffect).toHaveBeenCalledTimes(1);
        expect(onSideEffect.mock.calls[0][0].value).toBe(456);
        expect(onSideEffect.mock.calls[0][1].prevData.value).toBe(123);
        expect(handleChange).toHaveBeenCalledTimes(0);

        await act(async () => {
            await onSideEffectPromise(onSideEffect);
        });

        expect(handleChange).toHaveBeenCalledTimes(0);
        // test for revert...
    });

    it('should set status correctly with promise that rejects', async () => {
        let onSideEffect = jest.fn(() => Promise.reject('error message!'));

        let parcel = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: false
        }));

        act(() => {
            result.current[0].set(456);
        });

        await act(async () => {
            await onSideEffectPromise(onSideEffect);
        });

        expect(result.current[1]).toEqual({
            status: 'rejected',
            isPending: false,
            isResolved: false,
            isRejected: true,
            error: 'error message!'
        });
    });

    it('should call onSideEffect with promise that resolves with result if onSideEffectUseResult = true', async () => {
        let handleChange = jest.fn();
        let onSideEffect = jest.fn(() => Promise.resolve(333));

        let parcel = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: true
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onSideEffect).toHaveBeenCalledTimes(1);
        expect(onSideEffect.mock.calls[0][0].value).toBe(456);
        expect(onSideEffect.mock.calls[0][1].prevData.value).toBe(123);
        expect(handleChange).toHaveBeenCalledTimes(0);

        await act(async () => {
            await onSideEffectPromise(onSideEffect);
        });

        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toBe(333);
    });

    it('should merge subsequent onSideEffect if promise resolves twice', async () => {
        let handleChange = jest.fn();
        let onSideEffect = jest.fn();
        onSideEffect
            .mockReturnValueOnce(Promise.resolve())
            .mockReturnValueOnce(Promise.resolve());

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: false
        }));

        act(() => {
            result.current[0].push(123);
            result.current[0].push(456);
        });

        // only process one change at a time...
        expect(onSideEffect).toHaveBeenCalledTimes(1);
        expect(onSideEffect.mock.calls[0][0].value).toEqual([123]);
        expect(onSideEffect.mock.calls[0][1].prevData.value).toEqual([]);

        // wait until the first promise is complete before firing off anything
        expect(handleChange).toHaveBeenCalledTimes(0);

        await act(async () => {
            await onSideEffectPromise(onSideEffect);
        });

        expect(onSideEffect).toHaveBeenCalledTimes(2);
        expect(onSideEffect.mock.calls[1][0].value).toEqual([123, 456]);
        expect(onSideEffect.mock.calls[1][1].prevData.value).toEqual([]);
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toEqual([123, 456]);
    });

    it('should merge subsequent onSideEffect if promise rejects and then resolves', async () => {
        let handleChange = jest.fn();
        let onSideEffect = jest.fn();
        onSideEffect
            .mockReturnValueOnce(Promise.reject())
            .mockReturnValueOnce(Promise.resolve());

        let parcel = new Parcel({
            value: [],
            handleChange
        });

        let {result} = renderHook(() => useParcelSideEffectAsync({
            parcel,
            onSideEffect,
            onSideEffectUseResult: false
        }));

        act(() => {
            result.current[0].push(123);
            result.current[0].push(456);
        });

        // only process one change at a time...
        expect(onSideEffect).toHaveBeenCalledTimes(1);
        expect(onSideEffect.mock.calls[0][0].value).toEqual([123]);
        expect(onSideEffect.mock.calls[0][1].prevData.value).toEqual([]);

        // wait until the first promise is complete before firing off anything
        expect(handleChange).toHaveBeenCalledTimes(0);

        await act(async () => {
            await onSideEffectPromise(onSideEffect);
        });

        expect(onSideEffect).toHaveBeenCalledTimes(2);
        expect(onSideEffect.mock.calls[1][0].value).toEqual([123, 456]);
        expect(onSideEffect.mock.calls[1][1].prevData.value).toEqual([]);
        expect(handleChange).toHaveBeenCalledTimes(1);
        expect(handleChange.mock.calls[0][0].value).toEqual([123, 456]);
    });
});
