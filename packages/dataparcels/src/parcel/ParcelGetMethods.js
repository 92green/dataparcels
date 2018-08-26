// @flow
import Types from '../types/Types';
import type Parcel from './Parcel';
export default (_this: Parcel): Object => ({

    spread: (): Object => ({
        value: _this.value,
        onChange: _this.onChange
    }),

    spreadDOM: (): Object => ({
        value: _this.value,
        onChange: _this.onChangeDOM
    }),

    hasDispatched: (): boolean => {
        return _this._treeshare.dispatch.hasPathDispatched(_this.path);
    },

    // location share methods (mutation methods)

    getInternalLocationShareData: (): Object => {
        return _this._treeshare.locationShare.get(_this.path);
    },

    setInternalLocationShareData: (partialData: Object) => {
        Types(`setInternalLocationShareData() expects param "partialData" to be`, `object`)(partialData);
        _this._treeshare.locationShare.set(_this.path, partialData);
    }
});
