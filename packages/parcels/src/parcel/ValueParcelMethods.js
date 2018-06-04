// @flow
import type {ParcelData} from '../types/Types';
import type Parcel from './Parcel';
import strip from '../parcelData/strip';
import ActionCreators from '../action/ActionCreators';

import shallowEquals from 'unmutable/lib/shallowEquals';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel): Object => ({

    // get methods

    raw: (): ParcelData => {
        return _this._parcelData;
    },

    data: (): ParcelData => {
        return pipeWith(
            _this._parcelData,
            strip()
        );
    },

    value: (): * => {
        return _this._parcelData.value;
    },

    spread: (): Object => ({
        value: _this.value(),
        onChange: _this.onChange
    }),

    spreadDOM: (): Object => ({
        value: _this.value(),
        onChange: _this.onChangeDOM
    }),

    meta: (metaKey: ?string = undefined): * => {
        let {meta} = _this._parcelData;
        return metaKey ? meta[metaKey] : {...meta};
    },

    equals: (otherParcel: Parcel): boolean => {
        let aa: Object = _this.raw();
        let bb: Object = otherParcel.raw();

        return aa.value === bb.value
            && aa.key === bb.key
            && aa.child === bb.child
            && shallowEquals(aa.meta)(bb.meta);
    },

    // change methods

    setSelf: (value: *) => {
        _this.dispatch(ActionCreators.setSelf(value));
    },

    updateSelf: (updater: Function) => {
        _this.setSelf(updater(_this.value()));
    },

    onChange: (newValue: *) => {
        _this.setSelf(newValue);
    },

    onChangeDOM: (event: Object) => {
        _this.onChange(event.target.value);
    },

    setMeta: (partialMeta: Object) => {
        _this.dispatch(ActionCreators.setMeta(partialMeta));
    },

    updateMeta: (updater: Function) => {
        let {meta} = _this._parcelData;
        _this.setMeta(updater(meta));
    },

    refresh: () => {
        _this._buffer();
        _this
            ._treeshare
            .registry
            .leaves(_this.id())
            .forEach((parcel: Parcel) => {
                parcel.dispatch(ActionCreators.ping());
            });
        _this._flush();
    }
});
