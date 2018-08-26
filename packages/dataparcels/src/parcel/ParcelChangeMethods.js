// @flow
import Types from '../types/Types';
import type Parcel from './Parcel';
import ChangeRequest from '../change/ChangeRequest';
import ActionCreators from '../change/ActionCreators';

import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel, dispatch: Function): Object => ({

    setSelf: (value: *) => {
        dispatch(ActionCreators.setSelf(value));
    },

    updateSelf: (updater: Function) => {
        Types(`updateSelf() expects param "updater" to be`, `function`)(updater);
        _this.setSelf(updater(_this.value));
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
        dispatch(ActionCreators.setMeta(partialMeta));
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
        dispatch(new ChangeRequest().setChangeRequestMeta(partialMeta));
    },

    ping: () => {
        dispatch(ActionCreators.ping());
    }
});
