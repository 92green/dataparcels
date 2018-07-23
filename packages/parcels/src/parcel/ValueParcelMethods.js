// @flow
import type {ParcelData} from '../types/Types';
import Types from '../types/Types';
import type Parcel from './Parcel';
import strip from '../parcelData/strip';
import ChangeRequest from '../change/ChangeRequest';
import ActionCreators from '../change/ActionCreators';

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

    meta: (): * => {
        let {meta} = _this._parcelData;
        return {...meta};
    },

    hasDispatched: (): boolean => {
        return _this._treeshare.dispatch.hasPathDispatched(_this.path());
    },

    getInternalLocationShareData: (): Object => {
        return _this._treeshare.locationShare.get(_this.path());
    },

    // change methods

    setSelf: (value: *) => {
        _this.dispatch(ActionCreators.setSelf(value));
    },

    updateSelf: (updater: Function) => {
        Types(`updateSelf() expects param "updater" to be`, `function`)(updater);
        _this.setSelf(updater(_this.value()));
    },

    onChange: (value: *) => {
        _this.setSelf(value);
    },

    onChangeDOM: (event: Object) => {
        Types(`onChangeDOM() expects param "event" to be`, `event`)(event);
        _this.onChange(event.currentTarget.value);
    },

    setMeta: (partialMeta: Object) => {
        Types(`setMeta() expects param "partialMeta" to be`, `object`)(partialMeta);
        _this.dispatch(ActionCreators.setMeta(partialMeta));
    },

    updateMeta: (updater: Function) => {
        Types(`updateMeta() expects param "updater" to be`, `function`)(updater);
        let {meta} = _this._parcelData;
        pipeWith(
            meta,
            updater,
            Types(`updateMeta() expects the result of updater() to be`, `object`),
            _this.setMeta
        );
    },

    setChangeRequestMeta: (partialMeta: Object) => {
        Types(`setChangeRequestMeta() expects param "partialMeta" to be`, `object`)(partialMeta);
        _this.dispatch(new ChangeRequest().setChangeRequestMeta(partialMeta));
    },

    ping: () => {
        _this.dispatch(ActionCreators.ping());
    },

    // mutation methods

    setInternalLocationShareData: (partialData: Object) => {
        Types(`setInternalLocationShareData() expects param "partialData" to be`, `object`)(partialData);
        _this._treeshare.locationShare.set(_this.path(), partialData);
    }
});
