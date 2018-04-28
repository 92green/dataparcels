// @flow
import type {
    Index,
    Key,
    ParcelData
} from '../types/Types';

import get from './get';
import has from './has';

export default (keyPath: Array<Key|Index>, notSetValue: * = undefined) => (parcelData: ParcelData): ParcelData => {
    for(let key of keyPath) {
        if(!has(key)(parcelData)) {
            return {
                value: undefined
            };
        }
        parcelData = get(key, notSetValue)(parcelData);
    }
    return parcelData;
};
