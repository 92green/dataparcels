// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import keyOrIndexToIndex from './keyOrIndexToIndex';
import wrapNumber from './wrapNumber';

import size from 'unmutable/lib/size';
import swap from 'unmutable/lib/swap';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index) => (parcelData: ParcelData): ParcelData => {

    let indexA: ?Index = keyOrIndexToIndex(key)(parcelData);
    if(typeof indexA !== "number") {
        return parcelData;
    }

    let valueSize = size()(parcelData.value);
    indexA = wrapNumber(indexA, valueSize);
    let indexB: Index = wrapNumber(indexA + 1, valueSize);

    return pipeWith(
        parcelData,
        update('value', swap(indexA, indexB)),
        update('child', swap(indexA, indexB))
    );
};
