// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import keyOrIndexToIndex from './keyOrIndexToIndex';

import swap from 'unmutable/lib/swap';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (keyA: Key|Index, keyB: Key|Index) => (parcelData: ParcelData): ParcelData => {

    let indexA: ?Index = keyOrIndexToIndex(keyA)(parcelData);
    let indexB: ?Index = keyOrIndexToIndex(keyB)(parcelData);

    if(typeof indexA === "undefined" || typeof indexB === "undefined") {
        return parcelData;
    }

    return pipeWith(
        parcelData,
        update('value', swap(indexA, indexB)),
        update('child', swap(indexA, indexB))
    );
};
