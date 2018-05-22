// @flow
import type Parcel from 'parcels';
import map from 'unmutable/lib/map';
import reduce from 'unmutable/lib/reduce';
import toArray from 'unmutable/lib/toArray';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (validators: ?Object = {}) => (parcel: Parcel): Parcel => {
    return pipeWith(
        parcel,
        ...pipeWith(
            validators,
            map((validatorArray: Function[], match: string): Function => {
                return parcel => parcel.addModifier({
                    modifier: ii => ii.modifyChange(({parcel, continueChange, newParcelData}: Object) => {
                        parcel.setMeta({
                            error: pipeWith(
                                validatorArray,
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
            }),
            toArray()
        )
    );
};
