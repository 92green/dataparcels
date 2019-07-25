// @flow

import type {ParcelUpdater} from 'dataparcels';

import Parcel from 'dataparcels';
import asRaw from 'dataparcels/asRaw';

export default (prevParcel: ?Parcel, ...pipe: ParcelUpdater[]) => (parcel: Parcel): Parcel => {
    let [changedParcel] = parcel._changeAndReturn((parcel) => {

        let setPrevParcel;
        if(prevParcel) {
            let prevParcelData = prevParcel.data;
            setPrevParcel = asRaw(() => prevParcelData);
        }

        return parcel
            .modifyDown(setPrevParcel || (ii => ii))
            .pipe(...pipe)
            ._setData(parcel.data);
    });

    return changedParcel;
};
