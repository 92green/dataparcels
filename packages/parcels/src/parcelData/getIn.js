// @flow
import type {
    Key,
    ParcelData
} from '../types/Types';

import get from './get';
import has from './has';

export default (keyPath: Array<Key>, notSetValue: * = undefined) => (parcelData: ParcelData): ParcelData => {
    for(let key of keyPath) {
        if(!has(key)(parcelData)) {
            return {
                value: undefined,
                key
            };
        }
        parcelData = get(key, notSetValue)(parcelData);
    }
    return parcelData;
};
