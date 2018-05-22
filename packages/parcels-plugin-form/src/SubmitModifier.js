// @flow
import type Parcel from 'parcels';
import type {ParcelData} from 'parcels';

import filter from 'unmutable/lib/filter';
import getIn from 'unmutable/lib/getIn';
import identity from 'unmutable/lib/identity';
import map from 'unmutable/lib/map';
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
    map(getIn(['value', 'meta', 'error'])),
    filter(identity())
);

export default (onSubmit: ?Function) => (parcel: Parcel): Parcel => {
    let ref = {};


    let newParcel = parcel
        .initialMeta({
            attemptedSubmit: false,
            submitting: false, // TODO - actionMeta can replace this
            submit: () => ref.submit()
        })
        .modifyChange(({parcel, continueChange, newParcelData, actions}: Object) => {
            let parcelData = newParcelData();
            if(!parcelData.meta.submitting) { // TODO - actionMeta can replace this
                continueChange();
                return;
            }

            if(onSubmit) {
                let errors = getErrors(parcelData);
                if(errors.length === 0) {
                    onSubmit(parcelData.value, parcelData);
                }
            }

            continueChange();
            parcel.setMeta({ // TODO - actionMeta can replace this
                submitting: false
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
