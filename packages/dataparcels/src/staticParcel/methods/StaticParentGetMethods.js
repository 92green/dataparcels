// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type {ParentType} from '../../types/Types';
import type StaticParcel from '../StaticParcel';

import parcelGet from '../../parcelData/get';
import parcelHas from '../../parcelData/has';
import parcelKeyOrIndexToKey from '../../parcelData/keyOrIndexToKey';

import map from 'unmutable/lib/map';
import size from 'unmutable/lib/size';
import toArray from 'unmutable/lib/toArray';
import toObject from 'unmutable/lib/toObject';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (_this: StaticParcel) => ({

    has: (key: Key|Index): boolean => {
        _this._prepareChildKeys();
        return parcelHas(key)(_this._parcelData);
    },

    size: (): number => {
        return size()(_this._parcelData.value);
    },

    get: (key: Key|Index, notFoundValue: ?* = undefined): StaticParcel => {
        _this._prepareChildKeys();
        return _this._pipeSelf(
            parcelGet(key, notFoundValue),
            {
                parent: _this
            }
        );
    },

    getIn: (keyPath: Array<Key|Index>, notFoundValue: ?* = undefined): StaticParcel => {
        let staticParcel = _this;

        for(let key of keyPath) {
            if(!staticParcel.isParent() || !staticParcel.has(key)) {
                return _this._pipeSelf(
                    () => ({
                        value: notFoundValue,
                        key: parcelKeyOrIndexToKey(key)(staticParcel.data)
                    }),
                    {
                        parent: _this
                    }
                );
            }
            staticParcel = staticParcel.get(key, notFoundValue);
        }
        return staticParcel;
    },

    children: (): ParentType<StaticParcel> => {
        return pipeWith(
            _this._parcelData.value,
            map((value, key) => _this.get(key))
        );
    },

    toObject: (): { [key: string]: StaticParcel } => {
        return toObject()(_this.children());
    },

    toArray: (): Array<StaticParcel> => {
        return toArray()(_this.children());
    }
});
