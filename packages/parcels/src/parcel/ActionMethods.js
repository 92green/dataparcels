// @flow
import type Parcel from './Parcel';
import type Action from '../change/Action';
import ChangeRequest from '../change/ChangeRequest';
import Reducer from '../change/Reducer';

import concat from 'unmutable/lib/concat';
import isNotEmpty from 'unmutable/lib/isNotEmpty';
import last from 'unmutable/lib/last';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel): Object => ({
    _buffer: () => {
        _this._actionBuffer.push([]);
    },

    _flush: () => {
        _this.dispatch(_this._actionBuffer.pop());
    },

    _skipReducer: (onDispatch: Function): Function => {
        onDispatch.SKIP_REDUCER = true;
        return onDispatch;
    },

    _thunkReducer: (onDispatch: Function): Function => {
        onDispatch.THUNK_REDUCER = true;
        return onDispatch;
    },

    dispatch: (dispatchable: Action|Action[]|ChangeRequest) => {
        if(dispatchable instanceof ChangeRequest) {
            // do nothing with change requests for now
            return;
        }

        let action = dispatchable;

        _this._treeshare.dispatch.markPathAsDispatched(_this.path());

        if(_this._actionBuffer.length > 0) {
            _this._actionBuffer = pipeWith(
                _this._actionBuffer,
                update(-1, concat(action))
            );

            _this._parcelData = Reducer(_this._parcelData, action);
            return;
        }

        let parcel: ?Function|Parcel = null;

        if(!_this._onDispatch.SKIP_REDUCER) {

            let reducerThunk: Function = (): Parcel => {
                let parcelDataFromRegistry = _this._treeshare
                    .registry
                    .get(_this._id.id())
                    .raw();

                let parcelData = Reducer(parcelDataFromRegistry, action);

                let parcel: parcelData = _this._create({
                    parcelData
                });

                if(_this._treeshare.hasPreModifier() && _this.id() === "^") {
                    parcel = _this._treeshare.getPreModifier().applyTo(parcel);
                }

                return parcel;
            };

            parcel = _this._onDispatch.THUNK_REDUCER
                ? reducerThunk
                : reducerThunk();
        }

        _this._onDispatch(parcel, [].concat(action));
    },

    batch: (batcher: Function) => {
        _this._buffer();
        batcher(_this);

        let shouldFlush: boolean = pipeWith(
            _this._actionBuffer,
            last(),
            isNotEmpty()
        );

        if(shouldFlush) {
            _this._flush();
        } else {
            _this._actionBuffer.pop();
        }
    }
});
