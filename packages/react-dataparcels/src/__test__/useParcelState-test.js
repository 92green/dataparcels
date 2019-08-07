// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelState from '../useParcelState';

jest.useFakeTimers();

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

    it('should update Parcel', () => {
        let {result} = renderHook(() => useParcelState({value: () => 123}));

        act(() => {
            result.current[0].set(456);
        });

        expect(result.current[0].value).toBe(456);
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
