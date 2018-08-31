// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type {ParcelData} from '../../types/Types';
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

    // prepare child keys only once per location
    // by preparing them and saving them to location share data

    _prepareChildKeys: () => (parcelData: ParcelData): ParcelData => {
        let {_childCache} = _this.getInternalLocationShareData();
        if(!parcelData.child) {
            if(!_childCache) {
                _childCache = prepareChildKeys()(parcelData).child;
                _this.setInternalLocationShareData({
                    _childCache
                });
            }

            return {
                ...parcelData,
                child: _childCache
            };

        }

        if(_childCache) {
            // once parcelData contains child, remove the temporary child cache
            _this.setInternalLocationShareData({
                _childCache: undefined
            });
        }

        return parcelData;
    },

    has: (key: Key|Index): boolean => {
        Types(`has() expects param "key" to be`, `keyIndex`)(key);

        return pipeWith(
            _this._parcelData,
            _this._methods._prepareChildKeys(),
            parcelHas(key)
        );
    },

    get: (key: Key|Index, notFoundValue: any): Parcel => {
        Types(`get() expects param "key" to be`, `keyIndex`)(key);

        let childParcelData = pipeWith(
            _this._parcelData,
            _this._methods._prepareChildKeys(),
            parcelGet(key, notFoundValue)
        );

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
        Types(`getIn() expects param "keyPath" to be`, `keyIndexPath`)(keyPath);
        var parcel = _this;
        for(let i = 0; i < keyPath.length; i++) {
            parcel = parcel.get(keyPath[i], i < keyPath.length - 1 ? {} : notFoundValue);
        }
        return parcel;
    },

    toObject: (mapper: ParcelMapper): { [key: string]: * } => {
        Types(`toObject() expects param "mapper" to be`, `function`)(mapper);

        return pipeWith(
            _this._parcelData.value,
            map((ii: *, key: string|number) => {
                let item = _this.get(key);
                return mapper(item, key, _this);
            })
        );
    },

    toArray: (mapper: ParcelMapper): Array<*> => {
        Types(`toArray() expects param "mapper" to be`, `function`)(mapper);
        return toArray()(_this.toObject(mapper));
    },

    size: (): number => size()(_this.value)
});
