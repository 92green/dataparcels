// @flow
import Types from '../types/Types';
import type {ParcelData} from '../types/Types';

import type Parcel from './Parcel';
import type Action from '../change/Action';
import ChangeRequest from '../change/ChangeRequest';

export default (_this: Parcel): Object => ({
    _handleChange: (_onHandleChange: Function, changeRequest: ChangeRequest) => {
        let parcel: Parcel = _this._create({
            parcelData: changeRequest
                .setBaseParcel(_this)
                .data()
        });

        _onHandleChange(parcel, changeRequest);
    },

    dispatch: (dispatchable: Action|Action[]|ChangeRequest) => {
        Types(`dispatch() expects param "dispatchable" to be`, `dispatchable`)(dispatchable);

        let {
            _onDispatch,
            _onHandleChange
        } = _this;

        _this._treeshare.dispatch.markPathAsDispatched(_this.path());

        let changeRequest: ChangeRequest = dispatchable instanceof ChangeRequest
            ? dispatchable
            : new ChangeRequest(dispatchable);

        if(!changeRequest._originId) {
            changeRequest._originId = _this.id();
            changeRequest._originPath = _this.path();
        }

        if(_this._dispatchBuffer) {
            _this._dispatchBuffer(changeRequest);
            return;
        }

        if(_onHandleChange) {
            _this._handleChange(_onHandleChange, changeRequest);
            return;
        }
        _onDispatch && _onDispatch(changeRequest);
    },

    batch: (batcher: Function, changeRequest: ?ChangeRequest) => {
        Types(`batch() expects param "batcher" to be`, `function`)(batcher);

        let parcelData: ParcelData = _this._parcelData;
        let lastBuffer = _this._dispatchBuffer;

        let buffer = changeRequest
            ? changeRequest.updateActions(() => []) // TODO - if changeRequest implements caching, is this enough data clearing?
            : new ChangeRequest();

        _this._dispatchBuffer = (changeRequest: ChangeRequest) => {
            buffer = buffer.merge(changeRequest);
            _this._parcelData = changeRequest
                .setBaseParcel(_this)
                .data();
        };

        batcher(_this);
        _this._dispatchBuffer = lastBuffer;
        if(buffer.actions().length === 0) {
            return;
        }

        _this._parcelData = parcelData;
        _this.dispatch(buffer);
    }
});
