// @flow
import type Parcel from 'parcels';
import filter from 'unmutable/lib/filter';
import identity from 'unmutable/lib/identity';
import map from 'unmutable/lib/map';
import reduce from 'unmutable/lib/reduce';
import toArray from 'unmutable/lib/toArray';
import pipeWith from 'unmutable/lib/util/pipeWith';

type ValidModifierConfig = (parcel: Parcel) => Object;

const filterTruthy = filter(identity());

export default (validators: ValidModifierConfig) => (parcel: Parcel): Parcel => {

    let addModifier = (validatorArray: Function[], match: string) => (parcel: Parcel): Parcel => {
        return parcel.addModifier({
            modifier: ii => ii.modifyChange(({parcel, continueChange, newParcelData}: Object) => {
                parcel.setMeta({
                    error: pipeWith(
                        validatorArray,
                        filterTruthy,
                        reduce((error: *, validator: Function): * => {
                            if(error) {
                                return error;
                            }
                            return validator(newParcelData().value);
                        }, null)
                    )
                });
                continueChange();
            }),
            match
        });
    };

    return pipeWith(
        parcel,
        ...pipeWith(
            validators(parcel),
            filterTruthy,
            map(addModifier),
            toArray()
        )
    );
};
