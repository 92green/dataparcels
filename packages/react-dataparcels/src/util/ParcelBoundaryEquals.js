// @flow
import type Parcel from 'dataparcels';
import shallowEquals from 'unmutable/lib/shallowEquals';

export default (parcelA: ?Parcel, parcelB: ?Parcel): boolean => {
    if(!parcelA || !parcelB) {
        return false;
    }

    let aa: Object = parcelA.data;
    let bb: Object = parcelB.data;
    let isChild: boolean = parcelA.isChild() && parcelB.isChild();

    return aa.value === bb.value
        && aa.key === bb.key
        && aa.child === bb.child
        && shallowEquals(aa.meta)(bb.meta)
        && (!isChild || (parcelA.isFirst() === parcelB.isFirst() && parcelA.isLast() === parcelB.isLast()));
};
