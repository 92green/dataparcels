// @flow
import type ChangeRequest from '../../change/ChangeRequest';
import type {Index} from '../../types/Types';
import type {Key} from '../../types/Types';
import type Parcel from '../Parcel';
import type {ParcelData} from '../../types/Types';
import type {ParcelMapper} from '../../types/Types';
import Types from '../../types/Types';

import parcelForEach from '../../parcelData/forEach';
import parcelGet from '../../parcelData/get';
import parcelHas from '../../parcelData/has';

import size from 'unmutable/lib/size';
import toArray from 'unmutable/lib/toArray';

export default (_this: Parcel) => ({

    has: (key: Key|Index): boolean => {
        Types(`has() expects param "key" to be`, `keyIndex`)(key);
        return parcelHas(key)(_this._parcelData);
    },

    get: (key: Key|Index, notFoundValue: any): Parcel => {
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

    getIn: (keyPath: Array<Key|Index>, notFoundValue: any): Parcel => {
        Types(`getIn() expects param "keyPath" to be`, `keyIndexPath`)(keyPath);
        var parcel = _this;
        for(let i = 0; i < keyPath.length; i++) {
            parcel = parcel.get(keyPath[i], i < keyPath.length - 1 ? {} : notFoundValue);
        }
        return parcel;
    },

    toObject: (mapper: ParcelMapper): { [key: string]: Parcel } => {
        Types(`toObject() expects param "mapper" to be`, `function`)(mapper);
        let obj = {};

        parcelForEach((parcelData: ParcelData, index: string|number) => {
            let item = _this.get(index);
            let mapped = mapper(item, index, _this);
            obj[index] = mapped;
        })(_this._parcelData);

        return obj;
    },

    toArray: (mapper: ParcelMapper): Array<Parcel> => {
        Types(`toArray() expects param "mapper" to be`, `function`)(mapper);
        return toArray()(_this.toObject(mapper));
    },

    size: (): number => size()(_this.value)
});
