// @flow
import type Parcel, {ChangeRequest} from 'parcels';

export default ({onSubmit, onError}: Object) => (parcel: Parcel): Parcel => {
    let ref = {};

    let newParcel = parcel
        .initialMeta({
            attemptedSubmit: false,
            submit: () => ref.submit()
        })
        .modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {
            let parcelData = changeRequest.data();
            let {fromSubmit} = changeRequest.meta();
            let {errors} = parcelData.meta;

            if(fromSubmit) {
                if(errors && errors.length > 0) {
                    onError && onError(errors, parcelData);
                } else {
                    onSubmit && onSubmit(parcelData.value, parcelData);
                }
            }

            parcel.dispatch(changeRequest);
        });

    ref.submit = () => {
        newParcel.batch((parcel: Parcel) => {
            parcel.setMeta({
                attemptedSubmit: true
            });

            parcel.setChangeRequestMeta({
                fromSubmit: true
            });

            let {validate} = parcel.getInternalLocationShareData();
            validate && validate(parcel);
        });
    };

    return newParcel;
};
