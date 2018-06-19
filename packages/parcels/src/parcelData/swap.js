// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import hashKeyToIndex from './hashKeyToIndex';

import swap from 'unmutable/lib/swap';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (keyA: Key|Index, keyB: Key|Index) => (parcelData: ParcelData): ParcelData => {

    let indexA: Index = hashKeyToIndex(keyA)(parcelData);
    let indexB: Index = hashKeyToIndex(keyB)(parcelData);

    return pipeWith(
        parcelData,
        update('value', swap(indexA, indexB)),
        update('child', swap(indexA, indexB))
    );
};
