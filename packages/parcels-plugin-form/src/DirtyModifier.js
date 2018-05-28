// @flow
import type Parcel from 'parcels';

export default (match: string = "") => (parcel: Parcel): Parcel => {
    return parcel.addModifier({
        modifier: ii => ii
            .initialMeta({
                originalValue: ii.value()
            })
            .modifyChange(({parcel, continueChange, newParcelData}: Object) => {
                let {value, meta} = newParcelData();
                parcel.setMeta({
                    dirty: value !== meta.originalValue
                });
                continueChange();
            }),
        match: match || "**/*:!Parent"
    });
};
