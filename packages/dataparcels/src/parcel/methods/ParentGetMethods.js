// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type Parcel from '../Parcel';
import type {ParcelMapper} from '../../types/Types';
import Types from '../../types/Types';

import parcelGet from '../../parcelData/get';
import parcelHas from '../../parcelData/has';
import prepareChildKeys from '../../parcelData/prepareChildKeys';

import map from 'unmutable/lib/map';
import size from 'unmutable/lib/size';
import toArray from 'unmutable/lib/toArray';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: Parcel) => ({

    // prepare child keys only once per parcel instance
    // by preparing them and mutating this.parcelData

    _prepareChildKeys: () => {
        if(!_this._parcelData.child) {
            _this._parcelData = prepareChildKeys()(_this._parcelData);
        }
    },

    has: (key: Key|Index): boolean => {
        Types(`has()`, `key`, `keyIndex`)(key);

        _this._methods._prepareChildKeys();
        return parcelHas(key)(_this._parcelData);
    },

    get: (key: Key|Index, notFoundValue: any): Parcel => {
        Types(`get()`, `key`, `keyIndex`)(key);

        _this._methods._prepareChildKeys();
        let childParcelData = parcelGet(key, notFoundValue)(_this._parcelData);

        let childOnDispatch: Function = (changeRequest: ChangeRequest) => {
            _this.dispatch(changeRequest._unget(childParcelData.key));
        };

        return _this._create({
            parcelData: childParcelData,
            onDispatch: childOnDispatch,
            id: _this._id.push(childParcelData.key, _this.isIndexed()),
            parent: _this
        });
    },

    getIn: (keyPath: Array<Key|Index>, notFoundValue: any): Parcel => {
        Types(`getIn()`, `keyPath`, `keyIndexPath`)(keyPath);
        var parcel = _this;
        for(let i = 0; i < keyPath.length; i++) {
            parcel = parcel.get(keyPath[i], i < keyPath.length - 1 ? {} : notFoundValue);
        }
        return parcel;
    },

    toObject: (mapper: ParcelMapper): { [key: string]: * } => {
        Types(`toObject()`, `mapper`, `function`)(mapper);

        return pipeWith(
            _this._parcelData.value,
            map((ii: *, key: string|number) => {
                let item = _this.get(key);
                return mapper(item, key, _this);
            })
        );
    },

    toArray: (mapper: ParcelMapper): Array<*> => {
        Types(`toArray()`, `mapper`, `function`)(mapper);
        return toArray()(_this.toObject(mapper));
    },

    size: (): number => size()(_this.value)
});
