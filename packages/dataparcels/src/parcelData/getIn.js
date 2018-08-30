// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import pipeWith from 'unmutable/lib/util/pipeWith';

import get from './get';
import has from './has';
import keyOrIndexToKey from './keyOrIndexToKey';
import prepareChildKeys from './prepareChildKeys';

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
        parcelData = pipeWith(
            parcelData,
            prepareChildKeys(),
            get(key)
        );
    }
    return parcelData;
};
