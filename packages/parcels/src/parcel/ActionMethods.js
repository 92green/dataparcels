// @flow
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
        _this.dispatch(_this._dispatchBuffer.pop());
    },

    handleChange: (changeRequest: ChangeRequest) => {
        let {_onHandleChange} = _this;
        if(!_onHandleChange) {
            return;
        }

        let parcelDataFromRegistry = _this._treeshare
            .registry
            .get(_this._id.id())
            .raw();

        let parcel: Parcel = _this._create({
            parcelData: changeRequest
                .setBase(parcelDataFromRegistry)
                .data()
        });

        if(_this._treeshare.hasPreModifier() && _this.id() === "^") {
            parcel = _this._treeshare.getPreModifier().applyTo(parcel);
        }

        _onHandleChange(parcel, changeRequest);
    },

    dispatch: (dispatchable: Action|Action[]|ChangeRequest) => {
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

        if(_this._dispatchBuffer.length > 0) {
            _this._dispatchBuffer = pipeWith(
                _this._dispatchBuffer,
                update(-1, cc => (cc || new ChangeRequest()).merge(changeRequest))
            );

            _this._parcelData = changeRequest
                .setBase(_this._parcelData)
                .data();

            return;
        }

        if(_onHandleChange) {
            _this.handleChange(changeRequest);
            return;
        }
        _onDispatch && _onDispatch(changeRequest);
    },

    batch: (batcher: Function, changeRequest: ?ChangeRequest) => {
        _this._buffer(changeRequest);
        batcher(_this);

        let shouldFlush: boolean = pipeWith(
            _this._dispatchBuffer,
            last(),
            cc => cc && cc.actions().length > 0
        );

        if(shouldFlush) {
            _this._flush();
        } else {
            _this._dispatchBuffer.pop();
        }
    }
});
