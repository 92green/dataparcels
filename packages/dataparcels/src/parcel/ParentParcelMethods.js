// @flow
import type {Index, Key, ParcelData} from '../types/Types';
import Types from '../types/Types';

import type Parcel from './Parcel';
import MethodCreator from './MethodCreator';
import type ChangeRequest from '../change/ChangeRequest';

import parcelForEach from '../parcelData/forEach';
import parcelGet from '../parcelData/get';
import parcelHas from '../parcelData/has';

import size from 'unmutable/lib/size';
import toArray from 'unmutable/lib/toArray';

export default MethodCreator("Parent", (_this: Parcel): Object => ({

    // get methods

    has: (key: Key|Index): boolean => {
        Types(`has() expects param "key" to be`, `keyIndex`)(key);
        return parcelHas(key)(_this._parcelData);
    },

    get: (key: Key|Index, notFoundValue: ?*): Parcel => {
        Types(`get() expects param "key" to be`, `keyIndex`)(key);
        let childParcelData = parcelGet(key, notFoundValue)(_this._parcelData);

        let childOnDispatch: Function = (changeRequest: ChangeRequest) => {
            // $FlowFixMe - key *will* exist, but our types are too flexible and can't tell that
            _this.dispatch(changeRequest._unget(childParcelData.key));
        };

        return _this._create({
            parcelData: childParcelData,
            onDispatch: childOnDispatch,
            id: _this._id.push(childParcelData.key, _this.isIndexed()),
            parent: _this
        });
    },

    getIn: (keyPath: Array<Key|Index>, notFoundValue: ?*): Parcel => {
        Types(`getIn() expects param "keyPath" to be`, `keyIndexPath`)(keyPath);
        var parcel = _this;
        for(let i = 0; i < keyPath.length; i++) {
            parcel = parcel.get(keyPath[i], i < keyPath.length - 1 ? {} : notFoundValue);
        }
        return parcel;
    },

    toObject: (mapper: Function = ii => ii): Object => {
        Types(`toObject() expects param "mapper" to be`, `function`)(mapper);
        let obj = {};

        parcelForEach((parcelData: ParcelData, index: string|number) => {
            let item = _this.get(index);
            let mapped = mapper(item, index, _this);
            obj[index] = mapped;
        })(_this._parcelData);

        return obj;
    },

    toArray: (mapper: Function = ii => ii): Array<*> => {
        Types(`toArray() expects param "mapper" to be`, `function`)(mapper);
        return toArray()(_this.toObject(mapper));
    },

    size: () => size()(_this.value()),

    // change methods

    set: (key: Key|Index, value: *) => {
        Types(`set() expects param "key" to be`, `keyIndex`)(key);
        _this.get(key).setSelf(value);
    },

    update: (key: Key|Index, updater: Function) => {
        Types(`update() expects param "key" to be`, `keyIndex`)(key);
        Types(`update() expects param "updater" to be`, `function`)(updater);
        _this.get(key).updateSelf(updater);
    },

    setIn: (keyPath: Array<Key|Index>, value: *) => {
        Types(`setIn() expects param "keyPath" to be`, `keyIndexPath`)(keyPath);
        _this.getIn(keyPath).setSelf(value);
    },

    updateIn: (keyPath: Array<Key|Index>, updater: Function) => {
        Types(`updateIn() expects param "keyPath" to be`, `keyIndexPath`)(keyPath);
        Types(`update() expects param "updater" to be`, `function`)(updater);
        _this.getIn(keyPath).updateSelf(updater);
    }
}));
