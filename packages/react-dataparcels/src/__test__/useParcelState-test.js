// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelState from '../useParcelState';

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

describe('useParcelState should use config.modifyBeforeUpdate', () => {

    it('should apply single modifyBeforeUpdate to parcel', () => {
        let {result} = renderHook(() => useParcelState({
            value: 123,
            modifyBeforeUpdate: value => value * 2
        }));

        expect(result.current[0].value).toBe(123);

        act(() => {
            result.current[0].set(10);
        });

        expect(result.current[0].value).toBe(20);
    });

    it('should apply multiple modifyBeforeUpdate to parcel', () => {
        let {result} = renderHook(() => useParcelState({
            value: 123,
            modifyBeforeUpdate: [
                value => value * 2,
                value => value + 5
            ]
        }));

        expect(result.current[0].value).toBe(123);

        act(() => {
            result.current[0].set(10);
        });

        expect(result.current[0].value).toBe(25);
    });

    it('should apply single modifyBeforeUpdate to update value from props', () => {
        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcelState({
            value: props.foo,
            updateValue: true,
            modifyBeforeUpdate: value => value * 2
        }));

        expect(result.current[0].value).toBe(123);

        act(() => {
            rerender({foo: 10});
        });

        expect(result.current[0].value).toBe(20);
    });

    it('should apply multiple modifyBeforeUpdate to update value from props', () => {
        let {result, rerender} = renderHookWithProps({foo: 123}, (props) => useParcelState({
            value: props.foo,
            updateValue: true,
            modifyBeforeUpdate: [
                value => value * 2,
                value => value + 5
            ]
        }));

        expect(result.current[0].value).toBe(123);

        act(() => {
            rerender({foo: 10});
        });

        expect(result.current[0].value).toBe(25);
    });

});

