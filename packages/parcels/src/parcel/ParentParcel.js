// @flow
import type {
    Index,
    Key,
    ParcelData
} from '../types/Types';

import type Parcel from './Parcel';
import Action from '../action/Action';

import parcelForEach from '../parcelData/forEach';
import parcelGet from '../parcelData/get';
import parcelHas from '../parcelData/has';

import get from 'unmutable/lib/get';
import map from 'unmutable/lib/map';
import size from 'unmutable/lib/size';
import toArray from 'unmutable/lib/toArray';
import unshift from 'unmutable/lib/unshift';
import update from 'unmutable/lib/update';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel): Object => {
    if(!_this.isParent()) {
        throw new Error("!!!???"); // TODO proper error with tests
    }

    return {

        // get methods

        get: (key: Key|Index, notSetValue: * = undefined): ?Parcel => { // TODO notSetValue to be wrapped in a parcel
            if(!parcelHas(key)(_this._parcelData)) {
                return notSetValue;
            }

            let childParcelData: ParcelData = parcelGet(key)(_this._parcelData);

            let childHandleChange: Function = (parcelData: ParcelData, actions: Action[]) => {
                pipeWith(
                    actions,
                    map(pipe(
                        action => action.toJS(),
                        update('keyPath', unshift(key)),
                        action => new Action(action)
                    )),
                    _this.dispatch
                );
            };

            return _this._create({
                parcelData: childParcelData,
                handleChange: _this._skipReducer(childHandleChange),
                id: _this._id.push(childParcelData.key, _this.isIndexed())
            });
        },

        getIn: (keyPath: Array<Key|Index>, notSetValue: * = undefined): ?Parcel => { // TODO notSetValue to be wrapped in a parcel
            var parcel = _this;
            for(let key of keyPath) {
                if(!parcel) {
                    return notSetValue;
                }
                parcel = parcel.get(key, notSetValue);
            }
            return parcel;
        },

        toObject: (mapper: Function = ii => ii): Object => {
            let obj = {};

            parcelForEach((parcelData: ParcelData, index: string|number) => {
                let item = _this.get(index);
                let mapped = mapper(item, index, _this);
                obj[index] = mapped;
            })(_this._parcelData);

            return obj;
        },

        toArray: (mapper: Function = ii => ii): Array<*> => {
            return toArray()(_this.toObject(mapper));
        },

        size: () => size()(_this.value()),

        // change methods

        set: (key: Key|Index, value: *) => {
            _this.get(key).setSelf(value);
        },

        update: (key: Key|Index, updater: Function) => {
            _this.get(key).updateSelf(updater);
        },

        setIn: (keyPath: Array<Key|Index>, value: *) => {
            _this.getIn(keyPath).setSelf(value);
        },

        updateIn: (keyPath: Array<Key|Index>, updater: Function) => {
            _this.getIn(keyPath).updateSelf(updater);
        }
    };
};