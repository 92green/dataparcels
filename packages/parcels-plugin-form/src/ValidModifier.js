// @flow
import type Parcel from 'parcels';
import flatMap from 'unmutable/lib/flatMap';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import filter from 'unmutable/lib/filter';
import identity from 'unmutable/lib/identity';
import keyArray from 'unmutable/lib/keyArray';
import map from 'unmutable/lib/map';
import reduce from 'unmutable/lib/reduce';
import toArray from 'unmutable/lib/toArray';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

const specialFlatten = (keyPath: string[]) => (value: *): Array<Object> => {
    let output = [];
    let flatten = (value: *, path: string[] = []) => {
        output.push({
            path,
            value
        });
        pipeWith(
            value,
            getIn(keyPath),
            value => value && map((ii, key) => flatten(ii, [...keyPath, key]))(value)
        );
    };
    flatten(value);
    return output;
};

const getErrors = pipe(
    specialFlatten(['child']),
    map(pipe(
        update('value', getIn(['meta', 'error'])),
        update('label', getIn(['meta', 'label'])),
        update('path', filter((ii, index) => index % 2 === 1))
    )),
    filter(get('value'))
);

type ValidModifierConfig = (parcel: Parcel) => Object;

const filterTruthy = filter(identity());

export default (validatorCreator: ValidModifierConfig) => (parcel: Parcel): Parcel => {

    let validators = pipeWith(
        parcel,
        validatorCreator,
        filterTruthy,
        map(filterTruthy)
    );

    let addModifier = (validatorArray: Function[], match: string) => (parcel: Parcel): Parcel => {
        return parcel.addModifier({
            modifier: ii => ii.modifyChange(({parcel, continueChange, newParcelData}: Object) => {

                let error = pipeWith(
                    validatorArray,
                    reduce((error: *, validator: Function): * => {
                        if(error) {
                            return error;
                        }
                        return validator(newParcelData().value);
                    }, null)
                );

                parcel.setMeta({
                    error
                });
                continueChange();
            }),
            match
        });
    };

    let addValidModifier = (parcel: Parcel): Parcel => {
        let preparedParcel = parcel
            .initialMeta({
                errors: []
            })
            .modifyChange(({parcel, continueChange, newParcelData, actions}: Object) => {
                continueChange();
                let parcelData = newParcelData();
                let errors = getErrors(parcelData);
                parcel.setMeta({
                    errors
                });
            });

        preparedParcel.setInternalLocationShareData({
            validate: () => {
                preparedParcel.batch((preparedParcel: Parcel) => {
                    pipeWith(
                        validators,
                        keyArray(),
                        flatMap(preparedParcel.findAllMatching),
                        map((parcel: Parcel) => {
                            if(!parcel.hasDispatched()) {
                                parcel.ping();
                            }
                        })
                    );
                });
            }
        });

        return preparedParcel;
    };

    return pipeWith(
        parcel,
        ...pipeWith(
            validators,
            map(addModifier),
            toArray()
        ),
        addValidModifier
    );
};
