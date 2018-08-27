// @flow
import type Parcel from '../Parcel';
import Types from '../../types/Types';

import ParcelNode from '../../parcelNode/ParcelNode';

export default (_this: Parcel): Object => ({

    toParcelNode: (): ParcelNode => {
        let {
            value,
            meta,
            key,
            child
        } = _this._parcelData;

        return new ParcelNode(
            value,
            {
                meta,
                key,
                child
            }
        );
    },

    getInternalLocationShareData: (): Object => {
        return _this._treeshare.locationShare.get(_this.path);
    },

    setInternalLocationShareData: (partialData: Object) => {
        Types(`setInternalLocationShareData() expects param "partialData" to be`, `object`)(partialData);
        _this._treeshare.locationShare.set(_this.path, partialData);
    }
});
