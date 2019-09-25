// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelForm from '../useParcelForm';
import useParcelState from '../useParcelState';
import useParcelBuffer from '../useParcelBuffer';

jest.mock('../useParcelState.js');
jest.mock('../useParcelBuffer.js');

const getLastCall = (obj) => obj.mock.calls[obj.mock.calls.length - 1];
const getLastResult = (obj) => obj.mock.results[obj.mock.results.length - 1].value;

describe('useParcelForm should pass config to useParcelState', () => {

    it('should pass value and defaults to useParcelState', () => {
        renderHook(() => useParcelForm({
            value: 123
        }));

        let calledWith = getLastCall(useParcelState)[0];

        expect(calledWith.value).toBe(123);
        expect(calledWith.updateValue).toBe(false);
        expect(calledWith.onSubmit).toBe(undefined);
    });

    it('should pass updateValue to useParcelState', () => {
        renderHook(() => useParcelForm({
            value: 123,
            updateValue: true
        }));

        expect(getLastCall(useParcelState)[0].updateValue).toBe(true);
    });

    it('should pass rebase to useParcelState', () => {
        renderHook(() => useParcelForm({
            value: 123,
            rebase: true
        }));

        expect(getLastCall(useParcelState)[0].rebase).toBe(true);
    });

    it('should pass onSubmit to useParcelState, wrapping it in asyncChange', () => {
        let onSubmit = () => {};

        renderHook(() => useParcelForm({
            value: 123,
            onSubmit
        }));

        expect(typeof getLastCall(useParcelState)[0].onChange.sideEffectHook).toBe('function');
    });

    it('should pass onSubmitUseResult to useParcelState', () => {
        let onSubmitUseResult = true;

        renderHook(() => useParcelForm({
            value: 123,
            onSubmitUseResult
        }));

        expect(getLastCall(useParcelState)[0].onChangeUseResult).toBe(onSubmitUseResult);
    });

    it('should pass useParcelState control fields out of useParcelForm', () => {
        let {result} = renderHook(() => useParcelForm({
            value: 123
        }));

        expect(result.current[1]).toEqual(getLastResult(useParcelBuffer)[1]);
    });

});

describe('useParcelForm should pass config to useParcelBuffer', () => {

    it('should pass result of useParcelState to useParcelBuffer', () => {
        renderHook(() => useParcelForm({
            value: 123
        }));

        expect(getLastCall(useParcelBuffer)[0].parcel).toBe(getLastResult(useParcelState)[0]);
        expect(getLastCall(useParcelBuffer)[0].buffer).toBe(true);
        expect(getLastCall(useParcelBuffer)[0].debounce).toBe(0);
    });

    it('should pass buffer to useParcelBuffer', () => {
        renderHook(() => useParcelForm({
            value: 123,
            buffer: false
        }));

        expect(getLastCall(useParcelBuffer)[0].buffer).toBe(false);
    });

    it('should pass debounce to useParcelBuffer', () => {
        renderHook(() => useParcelForm({
            value: 123,
            debounce: 100
        }));

        expect(getLastCall(useParcelBuffer)[0].debounce).toBe(100);
    });

    it('should pass beforeChange item to useParcelBuffer', () => {
        let beforeChange = () => {};
        renderHook(() => useParcelForm({
            value: 123,
            beforeChange
        }));

        expect(getLastCall(useParcelBuffer)[0].beforeChange[0]).toBe(beforeChange);
    });

    it('should pass beforeChange array to useParcelBuffer', () => {
        let fn1 = () => {};
        let fn2 = () => {};
        let beforeChange = [fn1, fn2];
        renderHook(() => useParcelForm({
            value: 123,
            beforeChange
        }));

        expect(getLastCall(useParcelBuffer)[0].beforeChange[0]).toBe(fn1);
        expect(getLastCall(useParcelBuffer)[0].beforeChange[1]).toBe(fn2);
    });

    it('should pass result of useParcelBuffer out of useParcelForm', () => {
        let {result} = renderHook(() => useParcelForm({
            value: 123
        }));

        expect(result.current[0]).toBe(getLastResult(useParcelBuffer)[0]);
        expect(result.current[1]).toEqual(getLastResult(useParcelBuffer)[1]);
    });

});

describe('useParcelForm should use params.validation', () => {

    it('should pass no validation', () => {
        renderHook(() => useParcelForm({
            value: 123
        }));

        expect(getLastCall(useParcelBuffer)[0].beforeChange).toEqual([]);
    });

    it('should pass validation', () => {
        let validation = jest.fn((parcelData) => parcelData);

        renderHook(() => useParcelForm({
            value: 123,
            validation
        }));

        expect(getLastCall(useParcelBuffer)[0].beforeChange).toEqual([validation]);
    });

    it('should pass thunked validation', () => {
        let validation = jest.fn((parcelData) => parcelData);
        let thunkedValidation = jest.fn(() => validation);

        let {rerender} = renderHook(() => useParcelForm({
            value: 123,
            validation: thunkedValidation
        }));

        expect(getLastCall(useParcelBuffer)[0].beforeChange).toEqual([validation]);
        expect(thunkedValidation).toHaveBeenCalledTimes(1);

        act(() => {
            rerender();
        });

        expect(getLastCall(useParcelBuffer)[0].beforeChange).toEqual([validation]);
        expect(thunkedValidation).toHaveBeenCalledTimes(1);
    });

});
