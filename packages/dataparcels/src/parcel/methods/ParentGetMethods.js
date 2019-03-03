// @flow
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type Parcel from '../Parcel';
import type {ParcelMapper} from '../../types/Types';
import type {ParentType} from '../../types/Types';
import Types from '../../types/Types';

import parcelGet from '../../parcelData/get';
import parcelHas from '../../parcelData/has';
import prepareChildKeys from '../../parcelData/prepareChildKeys';

import clone from 'unmutable/lib/clone';
import first from 'unmutable/lib/first';
import last from 'unmutable/lib/last';
import map from 'unmutable/lib/map';
import size from 'unmutable/lib/size';
import toArray from 'unmutable/lib/toArray';
import toObject from 'unmutable/lib/toObject';
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

        // this shouldn't happen in reality, but I cant prove that to flow right now
        // and it rightly should be an error
        if(childParcelData.key === undefined) {
            throw new Error();
        }

        let childKey: Key = childParcelData.key;

        let childOnDispatch = (changeRequest) => changeRequest._addStep({
            type: 'get',
            key: childKey
        });

        let {child} = _this._parcelData;
        let childIsNotEmpty = size()(child) > 0;
        let isIndexed = _this._isIndexed;
        let isChildFirst = childIsNotEmpty && first()(child).key === childKey;
        let isChildLast = childIsNotEmpty && last()(child).key === childKey;

        return _this._create({
            parcelData: childParcelData,
            updateChangeRequestOnDispatch: childOnDispatch,
            id: _this._id.push(childKey, isIndexed),
            parent: {
                isIndexed,
                isChildFirst,
                isChildLast
            }
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

    children: (mapper: ParcelMapper): ParentType<Parcel> => {
        Types(`children()`, `mapper`, `function`)(mapper);

        return pipeWith(
            _this._parcelData.value,
            clone(),
            map((value, key) => mapper(_this.get(key), key, _this))
        );
    },

    toObject: (mapper: ParcelMapper): { [key: string]: Parcel } => {
        Types(`toObject()`, `mapper`, `function`)(mapper);
        return toObject()(_this.children(mapper));
    },

    toArray: (mapper: ParcelMapper): Array<Parcel> => {
        Types(`toArray()`, `mapper`, `function`)(mapper);
        return toArray()(_this.children(mapper));
    },

    size: (): number => size()(_this.value)
});
