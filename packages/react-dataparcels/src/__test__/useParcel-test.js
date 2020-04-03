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
