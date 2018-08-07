// @flow
import type Parcel from 'dataparcels';
import shallowEquals from 'unmutable/lib/shallowEquals';

export default (parcelA: Parcel, parcelB: Parcel): boolean => {
    let aa: Object = parcelA.data();
    let bb: Object = parcelB.data();

    return aa.value === bb.value
        && aa.key === bb.key
        && aa.child === bb.child
        && shallowEquals(aa.meta)(bb.meta);
};
