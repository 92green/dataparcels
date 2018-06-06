// @flow
import type Parcel from 'parcels';

export default ({onSubmit, onError}: Object) => (parcel: Parcel): Parcel => {
    let ref = {};

    let newParcel = parcel
        .initialMeta({
            attemptedSubmit: false,
            submitting: false, // TODO - actionMeta can replace this
            submit: () => ref.submit()
        })
        .modifyChange(({parcel, continueChange, newParcelData}: Object) => {
            let parcelData = newParcelData();
            let {submitting, errors} = parcelData.meta;

            if(!submitting) { // TODO - actionMeta can replace this
                continueChange();
                return;
            }

            if(errors && errors.length > 0) {
                onError && onError(errors, parcelData);
            } else {
                onSubmit && onSubmit(parcelData.value, parcelData);
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

            let {validate} = parcel.getInternalLocationShareData();
            validate && validate(parcel);
        });
    };

    return newParcel;
};
