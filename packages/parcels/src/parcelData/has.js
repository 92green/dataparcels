// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import decodeHashKey from './decodeHashKey';
import updateChild from './updateChild';
import updateChildKeys from './updateChildKeys';

import has from 'unmutable/lib/has';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index) => (parcelData: ParcelData): boolean => {

    if(!parcelData.child) {
        parcelData = pipeWith(
            parcelData,
            updateChild(),
            updateChildKeys()
        );
    }

    key = decodeHashKey(key)(parcelData);

    return has(key)(parcelData.value);
};
