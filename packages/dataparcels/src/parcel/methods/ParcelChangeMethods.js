// @flow
import type Parcel from '../Parcel';
import type {ParcelMeta} from '../../types/Types';
import type {ParcelValueUpdater} from '../../types/Types';
import type {ParcelShapeUpdateFunction} from '../../types/Types';
import Types from '../../types/Types';

import ActionCreators from '../../change/ActionCreators';
import ValidateValueUpdater from '../../util/ValidateValueUpdater';

export default (_this: Parcel, dispatch: Function) => ({

    setSelf: (value: *) => {
        dispatch(ActionCreators.setSelf(value));
    },

    updateSelf: (updater: ParcelValueUpdater|ParcelShapeUpdateFunction) => {
        Types(`updateSelf()`, `updater`, `function`)(updater);
        if(updater._isParcelUpdater) {
            // $FlowFixMe - this branch should only be hit with ParcelShapeUpdateFunction
            let updated = updater(_this._parcelData);
            dispatch(ActionCreators.setData(updated));
            return;
        }

        let {value} = _this;
        let updatedValue = updater(value);
        ValidateValueUpdater(value, updatedValue);
        _this.set(updatedValue);
    },

    onChange: _this.set,

    onChangeDOM: (event: Object) => {
        Types(`onChangeDOM()`, `event`, `event`)(event);
        _this.onChange(event.currentTarget.value);
    },

    setMeta: (partialMeta: ParcelMeta) => {
        Types(`setMeta()`, `partialMeta`, `object`)(partialMeta);
        dispatch(ActionCreators.setMeta(partialMeta));
    }
});
