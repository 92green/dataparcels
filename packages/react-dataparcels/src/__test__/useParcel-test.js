// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcel from '../useParcel';

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
