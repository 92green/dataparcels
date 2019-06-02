// @flow
import type {ParcelValueUpdater} from 'dataparcels';
import type Parcel from 'dataparcels';

export default (beforeChange: ?ParcelValueUpdater|ParcelValueUpdater[]) => {
    return (parcel: Parcel): Parcel => []
        .concat(beforeChange || [])
        .reduceRight(
            (parcel, updater) => parcel.modifyUp(updater),
            parcel
        );
};
