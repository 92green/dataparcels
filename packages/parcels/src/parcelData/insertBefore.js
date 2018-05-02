// @flow
import type {
    Key,
    ParcelData
} from '../types/Types';

import decodeHashKey from './decodeHashKey';
import updateChildKeys from './updateChildKeys';

import insert from 'unmutable/lib/insert';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key, newParcelData: ParcelData) => (parcelData: ParcelData): ParcelData => {
    key = decodeHashKey(key)(parcelData);
    return pipeWith(
        parcelData,
        update('value', insert(key, newParcelData.value)),
        update('child', insert(key, {})),
        updateChildKeys()
    );
};
