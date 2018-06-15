// @flow
import shallowEquals from 'unmutable/lib/shallowEquals';

export default (parcelA: Parcel, parcelB: Parcel): boolean => {
    let aa: Object = parcelA.raw();
    let bb: Object = parcelB.raw();

    return aa.value === bb.value
        && aa.key === bb.key
        && aa.child === bb.child
        && shallowEquals(aa.meta)(bb.meta);
};
