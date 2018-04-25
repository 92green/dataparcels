// @flow

import decodeHashKey from './decodeHashKey';

import swap from 'unmutable/lib/swap';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (keyA: number, keyB: number) => (parcelData: ParcelData): ParcelData => {
    keyA = decodeHashKey(keyA)(parcelData);
    keyB = decodeHashKey(keyB)(parcelData);
    return pipeWith(
        parcelData,
        update('value', swap(keyA, keyB)),
        update('child', swap(keyA, keyB))
    );
};
