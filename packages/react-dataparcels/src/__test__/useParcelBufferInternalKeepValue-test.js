// @flow
import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelBufferInternalKeepValue from '../useParcelBufferInternalKeepValue';
import Parcel from 'dataparcels';

const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

const value = {
    abc: 123,
    def: 456
};

describe('useParcelBufferInternalKeepValue should work', () => {

    it('should return false when keepValue is false and change comes from self', () => {

        let parcel = new Parcel({value}).get('abc');
        parcel._lastOriginId = "^.abc";

        let {result} = renderHook(() => useParcelBufferInternalKeepValue({
            keepValue: false,
            parcel
        }));

        expect(result.current).toBe(false);
    });

    it('should return true when keepValue is true and change comes from self', () => {

        let parcel = new Parcel({value}).get('abc');
        parcel._lastOriginId = "^.abc";

        let {result} = renderHook(() => useParcelBufferInternalKeepValue({
            keepValue: true,
            parcel
        }));

        expect(result.current).toBe(true);
    });

    it('should return true when keepValue is true and change comes from within self', () => {

        let parcel = new Parcel({value}).get('abc');
        parcel._lastOriginId = "^.abc.a";

        let {result} = renderHook(() => useParcelBufferInternalKeepValue({
            keepValue: true,
            parcel
        }));

        expect(result.current).toBe(true);
    });

    it('should return false when keepValue is true and change comes from elsewhere', () => {

        let parcel = new Parcel({value}).get('abc');
        parcel._lastOriginId = "^";

        let {result} = renderHook(() => useParcelBufferInternalKeepValue({
            keepValue: true,
            parcel
        }));

        expect(result.current).toBe(false);
    });

    it('should return true when a change from elsewhere contains the same value as the last change that came from self', () => {

        let parcel = new Parcel({value}).get('abc');
        parcel._lastOriginId = "^.abc";

        let {result, rerender} = renderHookWithProps({parcel}, ({parcel}) => useParcelBufferInternalKeepValue({
            keepValue: true,
            parcel
        }));

        expect(result.current).toBe(true);

        act(() => {
            // pretend that a another identical change came from 'def'
            parcel._lastOriginId = "^.def";

            rerender({
                parcel
            });
        });

        expect(result.current).toBe(true);

        act(() => {
            // pretend that a another change came from 'def', but this time with a changed value
            parcel = parcel._changeAndReturn(parcel => parcel.set(124))[0];
            parcel._lastOriginId = "^.def";

            rerender({
                parcel
            });
        });

        expect(result.current).toBe(false);
    });

    it('should clear any memory of received values if keepValue becomes false', () => {

        let parcel = new Parcel({value}).get('abc');
        parcel._lastOriginId = "^.abc";

        let {result, rerender} = renderHookWithProps(
            {
                parcel,
                keepValue: true
            },
            ({parcel, keepValue}) => useParcelBufferInternalKeepValue({
                keepValue,
                parcel
            })
        );

        expect(result.current).toBe(true);

        act(() => {
            rerender({
                parcel,
                keepValue: false
            });
        });

        act(() => {
            // pretend that a change came from 'def' with the same value
            // that was recieved when keepValue was last true
            parcel._lastOriginId = "^.def";

            rerender({
                parcel,
                keepValue: true
            });
        });

        expect(result.current).toBe(false);
    });

});
