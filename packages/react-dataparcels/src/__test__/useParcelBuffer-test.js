// @flow
// import {act} from 'react-hooks-testing-library';
import {renderHook} from 'react-hooks-testing-library';
import useParcelBuffer from '../useParcelBuffer';
import Parcel from 'dataparcels';

// const renderHookWithProps = (initialProps, callback) => renderHook(callback, {initialProps});

describe('useParcelBuffer should use config.parcel', () => {

    it('should pass through a parcel', () => {
        let parcel = new Parcel();

        let {result} = renderHook(() => useParcelBuffer({parcel}));

        expect(result.current[0]).toBe(parcel);
    });

});
