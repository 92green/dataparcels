// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelSideEffect from '../useParcelSideEffect';
import Parcel from 'dataparcels';

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

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
