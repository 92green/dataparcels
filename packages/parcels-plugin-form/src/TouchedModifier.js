// @flow
import type Parcel from 'parcels';

export default (match: string = "") => (parcel: Parcel): Parcel => {
    return parcel.addModifier({
        modifier: ii => ii.modifyChange(({parcel, continueChange}: Object) => {
            parcel.setMeta({
                touched: true
            });
            continueChange();
        }),
        match
    });
};
