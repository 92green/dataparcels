// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import keyOrIndexToIndex from './keyOrIndexToIndex';
import wrapNumber from '../util/wrapNumber';

import size from 'unmutable/lib/size';
import swap from 'unmutable/lib/swap';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index) => (parcelData: ParcelData): ParcelData => {

    let indexA: Index = keyOrIndexToIndex(key)(parcelData);
    let indexB: Index = wrapNumber(indexA - 1, size()(parcelData.value));

    return pipeWith(
        parcelData,
        update('value', swap(indexA, indexB)),
        update('child', swap(indexA, indexB))
    );
};
