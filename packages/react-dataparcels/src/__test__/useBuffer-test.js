// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useBuffer from '../useBuffer';
import Parcel from 'dataparcels';

jest.useFakeTimers();

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

describe('useBuffer source', () => {

    it('should pass through a parcels data', () => {
        let source = new Parcel({
            value: 123
        });

        let {result} = renderHook(() => useBuffer({source}));

        expect(result.current.data).toEqual(source.data);
    });

    it('should pass through a parcel on first hook call', () => {
        let source = new Parcel();
        let hookRenderer = jest.fn(() => useBuffer({source}));

        renderHook(hookRenderer);
        expect(hookRenderer.mock.results[0].value instanceof Parcel).toBe(true);
    });

    it('should propagate parcel change immediately', () => {
        let handleChange = jest.fn();

        let source = new Parcel({
            value: 123,
            handleChange
        });

        let {result} = renderHook(() => useBuffer({source}));

        act(() => {
            result.current.set(456);
        });

        expect(handleChange.mock.calls[0][0].value).toBe(456);
    });

    it('should pass same inner parcel if source is the same', () => {

        let source = new Parcel({
            value: 123
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source}));

        let firstResult = result.current;

        act(() => {
            rerender({
                source
            });
        });

        expect(result.current).toBe(firstResult);
    });

    it('should pass new inner parcel if source is different', () => {

        let source = new Parcel({
            value: 123
        });

        let {result, rerender} = renderHookWithProps({source}, ({source}) => useBuffer({source}));

        act(() => {
            result.current.set(124);
        });

        act(() => {
            rerender({
                source: new Parcel({
                    value: 456
                })
            });
        });

        // inner parcel should have sources value
        expect(result.current.value).toEqual(456);
    });
});
