// @flow
import type Parcel, {ChangeRequest} from 'parcels';

export default (match: string = "") => (parcel: Parcel): Parcel => {
    return parcel.addModifier({
        modifier: ii => ii.modifyChange((parcel: Parcel, changeRequest: ChangeRequest) => {
            parcel.dispatch(changeRequest);
            parcel.setMeta({
                touched: true
            });
        }),
        match
    });
};
