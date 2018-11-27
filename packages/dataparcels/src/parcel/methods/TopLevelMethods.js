// @flow
import type Parcel from '../Parcel';
import type {ParcelBatcher} from '../../types/Types';
import Types from '../../types/Types';

import ChangeRequest from '../../change/ChangeRequest';

export default (_this: Parcel): Object => ({

    batchAndReturn: (batcher: ParcelBatcher, changeRequest: ?ChangeRequest): ?Parcel => {
        Types(`batchAndReturn()`, `batcher`, `function`)(batcher);

        let newParcel;

        // swap out the parcels real _onHandleChange with a spy
        let handleChange = _this._onHandleChange;
        _this._onHandleChange = (parcel: Parcel) => {
            newParcel = parcel;
            newParcel._onHandleChange = handleChange;
        };
        _this.batch(batcher, changeRequest);
        _this._onHandleChange = handleChange;

        return newParcel;
    }
});
