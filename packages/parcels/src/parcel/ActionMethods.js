// @flow
import type Parcel from './Parcel';
import type Action from '../change/Action';
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

    _skipReducer: (handleChange: Function): Function => {
        handleChange.SKIP_REDUCER = true;
        return handleChange;
    },

    _thunkReducer: (handleChange: Function): Function => {
        handleChange.THUNK_REDUCER = true;
        return handleChange;
    },

    dispatch: (action: Action|Action[]) => {
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

        if(!_this._handleChange.SKIP_REDUCER) {

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

            parcel = _this._handleChange.THUNK_REDUCER
                ? reducerThunk
                : reducerThunk();
        }

        _this._handleChange(parcel, [].concat(action));
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
