// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import asRaw from 'dataparcels/asRaw';
import useParcelState from '../useParcelState';
import asyncChange from '../asyncChange';
import asyncValue from '../asyncValue';

jest.useFakeTimers();

const asyncValuePromise = (fn, index = 0) => fn.mock.results[index].value.catch(() => {});

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

describe('useParcelState should use config.value', () => {

    it('should create a Parcel from value', () => {
        let {result} = renderHook(() => useParcelState({value: 123}));
        expect(result.current[0].value).toBe(123);
    });

    it('should store the value from first render', () => {
        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcelState({
            value: props.foo
        }));

        expect(result.current[0].value).toBe(123);

        act(() => {
            rerender({foo: 456});
        });

        expect(result.current[0].value).toBe(123);
    });


    it('should create a Parcel from value thunk', () => {
        let {result} = renderHook(() => useParcelState({value: () => 123}));
        expect(result.current[0].value).toBe(123);
    });

    it('should create a Parcel from value updater', () => {
        let {result} = renderHook(() => useParcelState({value: asRaw(() => ({value: 123, meta: {abc: 456}}))}));
        expect(result.current[0].value).toBe(123);
        expect(result.current[0].meta).toEqual({abc: 456});
    });

    it('should update Parcel', () => {
        let {result} = renderHook(() => useParcelState({value: () => 123}));

        act(() => {
            result.current[0].set(456);
        });

        expect(result.current[0].value).toBe(456);
    });
});

describe('useParcelState should use config.value with asyncValue', () => {

    it('should use asyncValue', async () => {
        let fetcher = jest.fn(() => Promise.resolve(123));

        let {result} = renderHook(() => useParcelState({
            value: asyncValue(fetcher)
        }));

        expect(result.current[0].value).toBe(undefined);
        expect(result.current[1].valueStatus).toEqual({
            status: 'pending',
            isPending: true,
            isResolved: false,
            isRejected: false,
            error: undefined
        });

        await act(async () => {
            await asyncValuePromise(fetcher);
        });

        expect(result.current[0].value).toBe(123);
        expect(result.current[1].valueStatus).toEqual({
            status: 'resolved',
            isPending: false,
            isResolved: true,
            isRejected: false,
            error: undefined
        });
    });

    it('should use asyncValue and handle rejections', async () => {
        let fetcher = jest.fn(() => Promise.reject('error message!'));

        let {result} = renderHook(() => useParcelState({
            value: asyncValue(fetcher)
        }));

        await act(async () => {
            await asyncValuePromise(fetcher);
        });

        expect(result.current[0].value).toBe(undefined);
        expect(result.current[1].valueStatus).toEqual({
            status: 'rejected',
            isPending: false,
            isResolved: false,
            isRejected: true,
            error: 'error message!'
        });
    });

    it('should pass asyncValue through beforeChange', async () => {
        let fetcher = () => Promise.resolve(123);

        let {result} = renderHook(() => useParcelState({
            value: asyncValue(fetcher),
            beforeChange: value => value * 2
        }));

        await act(fetcher);

        expect(result.current[0].value).toBe(246);
    });

});

describe('useParcelState should use config.updateValue', () => {

    it('should not take value from second render when updateValue = false', () => {
        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcelState({
            value: props.foo,
            updateValue: false
        }));

        expect(result.current[0].value).toBe(123);

        act(() => {
            rerender({foo: 456});
        });

        expect(result.current[0].value).toBe(123);
    });

    it('should take value from second render when updateValue = true', () => {
        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcelState({
            value: props.foo,
            updateValue: true
        }));

        expect(result.current[0].value).toBe(123);

        act(() => {
            rerender({foo: 456});
        });

        expect(result.current[0].value).toBe(456);
    });

    it('should not take value from second render when updateValue = true and value is strictly equal', () => {
        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcelState({
            value: props.foo,
            updateValue: false
        }));

        expect(result.current[0].value).toBe(123);

        act(() => {
            result.current[0].set(789);
            rerender({foo: 123});
        });

        expect(result.current[0].value).toBe(789);
    });

    // it('should allow updater to be passed as value', () => {
    //     let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcelState({
    //         value: props.foo,
    //         updateValue: true
    //     }));

    //     expect(result.current[0].value).toBe(123);

    //     act(() => {
    //         rerender({foo: 456});
    //     });

    //     expect(result.current[0].value).toBe(456);
    // });
});

describe('useParcelState should use config.onChange', () => {

    it('should call onChange with value and change request if provided', () => {
        let onChange = jest.fn();

        let {result} = renderHook(() => useParcelState({
            value: () => 123,
            onChange
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toBe(456);
        expect(onChange.mock.calls[0][1].prevData.value).toBe(123);
        expect(result.current[0].value).toBe(456);
    });

    it('should call onChange with onChangeUseResult provided', () => {
        let onChange = jest.fn(() => 333);

        let {result} = renderHook(() => useParcelState({
            value: () => 123,
            onChange,
            onChangeUseResult: true
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toBe(456);
        expect(onChange.mock.calls[0][1].prevData.value).toBe(123);
        expect(result.current[0].value).toBe(333);
    });

    it('should not call onChange as a result of updateValue', () => {
        let onChange = jest.fn();

        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcelState({
            value: props.foo,
            updateValue: true,
            onChange
        }));

        expect(result.current[0].value).toBe(123);

        act(() => {
            rerender({foo: 456});
        });

        expect(onChange).not.toHaveBeenCalled();
    });

    it('should call onChange with asyncChange if provided', async () => {

        const onChangePromise = (onChange, index = 0) => onChange.mock.results[index].value.catch(() => {});

        let onChange = jest.fn(() => Promise.resolve(333));

        let {result} = renderHook(() => useParcelState({
            value: () => 123,
            onChange: asyncChange(onChange)
        }));

        expect(result.current[1].changeStatus.status).toBe('idle');

        act(() => {
            result.current[0].set(456);
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toBe(456);
        expect(onChange.mock.calls[0][1].prevData.value).toBe(123);
        expect(result.current[0].value).toBe(123);
        expect(result.current[1].changeStatus.status).toBe('pending');

        await act(async () => {
            await onChangePromise(onChange);
        });

        expect(result.current[0].value).toBe(456);
        expect(result.current[1].changeStatus.status).toBe('resolved');
    });

    it('should call onChange with asyncChange and onChangeUseResult if provided', async () => {

        const onChangePromise = (onChange, index = 0) => onChange.mock.results[index].value.catch(() => {});

        let onChange = jest.fn(() => Promise.resolve(333));

        let {result} = renderHook(() => useParcelState({
            value: () => 123,
            onChange: asyncChange(onChange),
            onChangeUseResult: true
        }));

        act(() => {
            result.current[0].set(456);
        });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange.mock.calls[0][0].value).toBe(456);
        expect(onChange.mock.calls[0][1].prevData.value).toBe(123);
        expect(result.current[0].value).toBe(123);

        await act(async () => {
            await onChangePromise(onChange);
        });

        expect(result.current[0].value).toBe(333);
    });

});

describe('useParcelState should use config.beforeChange', () => {

    it('should apply single beforeChange to parcel', () => {
        let {result} = renderHook(() => useParcelState({
            value: 123,
            beforeChange: value => value * 2
        }));

        expect(result.current[0].value).toBe(246);

        act(() => {
            result.current[0].set(10);
        });

        expect(result.current[0].value).toBe(20);

        act(() => {
            result.current[0].set(100);
        });

        expect(result.current[0].value).toBe(200);
    });

    it('should apply multiple beforeChange to parcel', () => {
        let {result} = renderHook(() => useParcelState({
            value: 123,
            beforeChange: [
                value => value * 2,
                value => value + 5
            ]
        }));

        expect(result.current[0].value).toBe(251);

        act(() => {
            result.current[0].set(10);
        });

        expect(result.current[0].value).toBe(25);
    });

    it('should apply single beforeChange to update value from props', () => {
        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcelState({
            value: props.foo,
            updateValue: true,
            beforeChange: value => value * 2
        }));

        expect(result.current[0].value).toBe(246);

        act(() => {
            rerender({foo: 10});
        });

        expect(result.current[0].value).toBe(20);
    });

    it('should apply multiple beforeChange to update value from props', () => {
        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcelState({
            value: props.foo,
            updateValue: true,
            beforeChange: [
                value => value * 2,
                value => value + 5
            ]
        }));

        expect(result.current[0].value).toBe(251);

        act(() => {
            rerender({foo: 10});
        });

        expect(result.current[0].value).toBe(25);
    });

});

describe('useParcelState should use config.rebase', () => {

    it('should set frame meta of rebase = true', () => {
        let {result} = renderHook(() => useParcelState({
            value: 123,
            rebase: true
        }));

        expect(result.current[0]._frameMeta.rebase).toBe(true);
    });

    it('should not normally set frame meta of rebase = true', () => {
        let {result} = renderHook(() => useParcelState({
            value: 123
        }));

        expect(!result.current[0]._frameMeta.rebase).toBe(true);
    });
});
