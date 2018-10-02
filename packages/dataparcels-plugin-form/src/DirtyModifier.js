// @flow
import type Parcel, {ChangeRequest} from 'dataparcels';

export default (match: string = "") => (parcel: Parcel): Parcel => {
    return parcel.matchPipe(
        match || "**/*:!Parent",
        ii => ii
            .initialMeta({
                originalValue: ii.value
            })
            .modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {
                parcel.dispatch(changeRequest);

                let {value, meta} = changeRequest;
                parcel.setMeta({
                    dirty: value !== meta.originalValue
                });
            }),
    );
};
