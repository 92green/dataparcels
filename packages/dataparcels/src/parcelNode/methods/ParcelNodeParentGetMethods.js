// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type {ParcelData} from '../../types/Types';
import type {ParcelNodeMapper} from '../../types/Types';
import Types from '../../types/Types';

import type ParcelNode from '../ParcelNode';

import parcelForEach from '../../parcelData/forEach';
import parcelGet from '../../parcelData/get';
import parcelHas from '../../parcelData/has';

import size from 'unmutable/lib/size';
import toArray from 'unmutable/lib/toArray';

export default (_this: ParcelNode) => ({

    has: (key: Key|Index): boolean => {
        Types(`has() expects param "key" to be`, `keyIndex`)(key);
        return parcelHas(key)(_this._parcelData);
    },

    get: (key: Key|Index, notFoundValue: any): ParcelNode => {
        Types(`get() expects param "key" to be`, `keyIndex`)(key);
        let childParcelData = parcelGet(key, notFoundValue)(_this._parcelData);

        return _this._create({
            parcelData: childParcelData,
            parent: _this
        });
    },

    getIn: (keyPath: Array<Key|Index>, notFoundValue: any): ParcelNode => {
        Types(`getIn() expects param "keyPath" to be`, `keyIndexPath`)(keyPath);
        var parcel = _this;
        for(let i = 0; i < keyPath.length; i++) {
            parcel = parcel.get(keyPath[i], i < keyPath.length - 1 ? {} : notFoundValue);
        }
        return parcel;
    },

    toObject: (mapper: ParcelNodeMapper): { [key: string]: * } => {
        Types(`toObject() expects param "mapper" to be`, `function`)(mapper);
        let obj = {};

        parcelForEach((parcelData: ParcelData, index: string|number) => {
            let item = _this.get(index);
            let mapped = mapper(item, index, _this);
            obj[index] = mapped;
        })(_this._parcelData);

        return obj;
    },

    toArray: (mapper: ParcelNodeMapper): Array<*> => {
        Types(`toArray() expects param "mapper" to be`, `function`)(mapper);
        return toArray()(_this.toObject(mapper));
    },

    size: (): number => size()(_this.value)
});
