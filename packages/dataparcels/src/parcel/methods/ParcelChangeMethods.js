// @flow
import type Action from '../../change/Action';
import type Parcel from '../Parcel';
import type {ParcelMeta} from '../../types/Types';
import type {ParcelValueUpdater} from '../../types/Types';
import Types from '../../types/Types';

import ChangeRequest from '../../change/ChangeRequest';
import ActionCreators from '../../change/ActionCreators';
import ValidateValueUpdater from '../../util/ValidateValueUpdater';

export default (_this: Parcel) => ({

    dispatch: (dispatchable: Action|Action[]|ChangeRequest) => {
        Types(`dispatch()`, `dispatchable`, `dispatchable`)(dispatchable);

        let {
            _updateChangeRequestOnDispatch,
            _onHandleChange
        } = _this;

        let changeRequest: ChangeRequest = dispatchable instanceof ChangeRequest
            ? dispatchable
            : new ChangeRequest(dispatchable);

        if(!changeRequest._originId) {
            changeRequest._originId = _this.id;
            changeRequest._originPath = _this.path;
        }

        if(process.env.NODE_ENV !== 'production' && _this._log) {
            console.log(`Parcel: "${_this._logName}" data up:`); // eslint-disable-line
            console.log(changeRequest.toJS()); // eslint-disable-line
        }

        if(_onHandleChange) {
            let changeRequestWithBase = changeRequest._create({
                prevData: _this.data
            });
            let parcelData = changeRequestWithBase.nextData;

            if(!parcelData) {
                return;
            }

            let parcelWithChangedData = _this._create({
                handleChange: _onHandleChange,
                parcelData,
                lastOriginId: changeRequest.originId
            });

            _onHandleChange(parcelWithChangedData, changeRequestWithBase);
            return;
        }

        _this._dispatchToParent(_updateChangeRequestOnDispatch(changeRequest));
    },

    setSelf: (value: *) => {
        _this.dispatch(ActionCreators.setSelf(value));
    },

    updateSelf: (updater: ParcelValueUpdater) => {
        Types(`updateSelf()`, `updater`, `function`)(updater);
        if(updater._isParcelUpdater) {
            let updated = updater(_this._parcelData);
            _this.dispatch(ActionCreators.setData(updated));
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
        _this.dispatch(ActionCreators.setMeta(partialMeta));
    }
});
