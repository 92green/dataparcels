// @flow
import type Parcel from '../Parcel';
import type {ParcelMeta} from '../../types/Types';
import type {ParcelValueUpdater} from '../../types/Types';
import type {StaticParcelUpdater} from '../../types/Types';
import Types from '../../types/Types';

import ChangeRequest from '../../change/ChangeRequest';
import ActionCreators from '../../change/ActionCreators';
import StaticParcel from '../../staticParcel/StaticParcel';
import ValidateValueUpdater from '../../util/ValidateValueUpdater';

export default (_this: Parcel, dispatch: Function) => ({

    setSelf: (value: *) => {
        dispatch(ActionCreators.setSelf(value));
    },

    updateSelf: (updater: ParcelValueUpdater) => {
        Types(`updateSelf()`, `updater`, `function`)(updater);
        let {value} = _this;
        let updatedValue = updater(value, _this);
        ValidateValueUpdater(value, updatedValue);
        _this.set(updatedValue);
    },

    updateSelfDeep: (updater: StaticParcelUpdater) => {
        Types(`updateSelfDeep()`, `updater`, `function`)(updater);
        let staticParcelUpdater = StaticParcel._updateFromData(updater);
        let updated = staticParcelUpdater(_this._parcelData);
        dispatch(ActionCreators.setData(updated));
    },

    onChange: _this.set,

    onChangeDOM: (event: Object) => {
        Types(`onChangeDOM()`, `event`, `event`)(event);
        _this.onChange(event.currentTarget.value);
    },

    setMeta: (partialMeta: ParcelMeta) => {
        Types(`setMeta()`, `partialMeta`, `object`)(partialMeta);
        dispatch(ActionCreators.setMeta(partialMeta));
    },

    setChangeRequestMeta: (partialMeta: ParcelMeta) => {
        Types(`setChangeRequestMeta()`, `partialMeta`, `object`)(partialMeta);
        dispatch(new ChangeRequest().setChangeRequestMeta(partialMeta));
    }
});
