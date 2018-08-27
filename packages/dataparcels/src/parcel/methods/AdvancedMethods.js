// @flow
import type Parcel from '../Parcel';
import Types from '../../types/Types';

import ParcelNode from '../../parcelNode/ParcelNode';

export default (_this: Parcel): Object => ({

    toParcelNode: (): ParcelNode => {
        return new ParcelNode({
            parcelData: _this._parcelData,
            id: _this._id
        });
    },

    getInternalLocationShareData: (): Object => {
        return _this._treeshare.locationShare.get(_this.path);
    },

    setInternalLocationShareData: (partialData: Object) => {
        Types(`setInternalLocationShareData() expects param "partialData" to be`, `object`)(partialData);
        _this._treeshare.locationShare.set(_this.path, partialData);
    }
});
