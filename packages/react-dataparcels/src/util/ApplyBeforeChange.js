// @flow
import type {ParcelValueUpdater} from 'dataparcels';
import type Parcel from 'dataparcels';

export default (beforeChange: ParcelValueUpdater[]) => {
    return (parcel: Parcel): Parcel => beforeChange.reduceRight(
        (parcel, updater) => parcel.modifyUp(updater),
        parcel
    );
};
