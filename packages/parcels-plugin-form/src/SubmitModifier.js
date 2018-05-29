// @flow
import type Parcel from 'parcels';

import filter from 'unmutable/lib/filter';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import map from 'unmutable/lib/map';
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

let getErrors = pipe(
    specialFlatten(['child']),
    map(pipe(
        update('value', getIn(['meta', 'error'])),
        update('label', getIn(['meta', 'label'])),
        update('path', filter((ii, index) => index % 2 === 1))
    )),
    filter(get('value'))
);

export default ({onSubmit, onError}: Object) => (parcel: Parcel): Parcel => {
    let ref = {};


    let newParcel = parcel
        .initialMeta({
            attemptedSubmit: false,
            errors: [],
            submitting: false, // TODO - actionMeta can replace this
            submit: () => ref.submit()
        })
        .modifyChange(({parcel, continueChange, newParcelData}: Object) => {
            let parcelData = newParcelData();
            if(!parcelData.meta.submitting) { // TODO - actionMeta can replace this
                continueChange();
                return;
            }

            let errors = getErrors(parcelData);
            if(errors.length === 0) {
                onSubmit && onSubmit(parcelData.value, parcelData);
            } else {
                onError && onError(errors, parcelData);
            }

            continueChange();
            parcel.setMeta({ // TODO - actionMeta can replace this
                submitting: false,
                errors
            });
        });

    ref.submit = () => {
        newParcel.batch((parcel: Parcel) => {
            parcel.setMeta({
                attemptedSubmit: true,
                submitting: true
            });
            parcel.refresh();
        });
    };

    return newParcel;
};
