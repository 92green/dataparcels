// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import get from './get';
import has from './has';
import keyOrIndexToKey from './keyOrIndexToKey';

export default (keyPath: Array<Key|Index>) => (parcelData: ParcelData): ParcelData => {
    for(let key of keyPath) {
        if(!has(key)(parcelData)) {
            let stringKey: Key = keyOrIndexToKey(key)(parcelData);
            return {
                value: undefined,
                key: stringKey,
                meta: {},
                child: undefined
            };
        }
        parcelData = get(key)(parcelData);
    }
    return parcelData;
};
