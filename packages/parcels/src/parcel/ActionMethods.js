// @flow
import Types from '../types/Types';

import type Parcel from './Parcel';
import type Action from '../change/Action';
import ChangeRequest from '../change/ChangeRequest';

import last from 'unmutable/lib/last';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel): Object => ({
    _buffer: (changeRequest: ?ChangeRequest) => {
        let initialBuffer: ?ChangeRequest = changeRequest
            ? changeRequest.updateActions(() => []) // TODO - if changeRequest implements caching, is this enough data clearing?
            : null;

        _this._dispatchBuffer.push(initialBuffer);
    },

    _flush: () => {
        let shouldFlush: boolean = pipeWith(
            _this._dispatchBuffer,
            last(),
            cc => cc && cc.actions().length > 0
        );

        let changeRequest = _this._dispatchBuffer.pop();
        if(shouldFlush) {
            _this.dispatch(changeRequest, true);
        }
    },

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
        // ^ what if this is done during a batch()? should it count?

        let changeRequest: ChangeRequest = dispatchable instanceof ChangeRequest
            ? dispatchable
            : new ChangeRequest(dispatchable);

        if(!changeRequest._originId) {
            changeRequest._originId = _this.id();
            changeRequest._originPath = _this.path();
        }

        if(_this._dispatchBuffer.length > 0) {
            _this._dispatchBuffer = pipeWith(
                _this._dispatchBuffer,
                update(-1, cc => (cc || new ChangeRequest()).merge(changeRequest))
            );

            _this._parcelData = changeRequest
                .setBaseParcel(_this)
                .data();

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
        _this._buffer(changeRequest);
        batcher(_this);
        _this._flush();
    }
});
