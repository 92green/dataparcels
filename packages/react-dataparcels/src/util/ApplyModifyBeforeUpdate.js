// @flow
import type {ParcelValueUpdater} from 'dataparcels';
import type Parcel from 'dataparcels';

export default (modifyBeforeUpdate: ?ParcelValueUpdater|ParcelValueUpdater[]) => {
    return (parcel: Parcel): Parcel => {
        return []
            .concat(modifyBeforeUpdate || [])
            .reduceRight(
                (parcel, updater) => parcel.modifyUp(updater),
                parcel
            );
    };
};
