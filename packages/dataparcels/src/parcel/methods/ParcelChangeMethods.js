// @flow
import type Parcel from '../Parcel';
import type {ParcelMeta} from '../../types/Types';
import type {ParcelValueUpdater} from '../../types/Types';
import Types from '../../types/Types';

import ChangeRequest from '../../change/ChangeRequest';
import ActionCreators from '../../change/ActionCreators';

export default (_this: Parcel, dispatch: Function) => ({

    setSelf: (value: *) => {
        dispatch(ActionCreators.setSelf(value));
    },

    updateSelf: (updater: ParcelValueUpdater) => {
        Types(`updateSelf()`, `updater`, `function`)(updater);
        _this.set(updater(_this.value));
    },

    onChange: (value: *) => {
        _this.set(value);
    },

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
