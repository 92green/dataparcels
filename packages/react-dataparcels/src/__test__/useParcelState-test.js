// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelState from '../useParcelState';

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

test('useParcelState should create a Parcel from value', () => {
    let {result} = renderHook(() => useParcelState({value: 123}));
    expect(result.current[0].value).toBe(123);
});

test('useParcelState should store the value from first render', () => {
    let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcelState({
        value: props.foo
    }));

    expect(result.current[0].value).toBe(123);

    act(() => {
        rerender({foo: 456});
    });

    expect(result.current[0].value).toBe(123);
});


test('useParcelState should create a Parcel from value thunk', () => {
    let {result} = renderHook(() => useParcelState({value: () => 123}));
    expect(result.current[0].value).toBe(123);
});

test('useParcelState should update Parcel', () => {
    let {result} = renderHook(() => useParcelState({value: () => 123}));

    act(() => {
        result.current[0].set(456);
    });

    expect(result.current[0].value).toBe(456);
});
