// @flow

import decodeHashKey from './decodeHashKey';
import wrapNumber from '../util/wrapNumber';

import size from 'unmutable/lib/size';
import swap from 'unmutable/lib/swap';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: number) => (parcelData: ParcelData): ParcelData => {
    let keyA = decodeHashKey(key)(parcelData);
    let keyB = wrapNumber(keyA + 1, size()(parcelData.value));
    return pipeWith(
        parcelData,
        update('value', swap(keyA, keyB)),
        update('child', swap(keyA, keyB))
    );
};
