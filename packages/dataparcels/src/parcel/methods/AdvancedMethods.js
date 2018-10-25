// @flow
import type Parcel from '../Parcel';
import Types from '../../types/Types';

export default (_this: Parcel): Object => ({

    getInternalLocationShareData: (): Object => {
        return _this._treeshare.locationShare.get(_this.path);
    },

    setInternalLocationShareData: (partialData: Object) => {
        Types(`setInternalLocationShareData()`, `partialData`, `object`)(partialData);
        _this._treeshare.locationShare.set(_this.path, partialData);
    }
});
