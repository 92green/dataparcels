// @flow
import type {
    Index,
    Key,
    ParcelData
} from '../types/Types';

import keyOrIndexToIndex from './keyOrIndexToIndex';
import updateChildKeys from './updateChildKeys';

import insert from 'unmutable/lib/insert';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index, newParcelData: ParcelData) => (parcelData: ParcelData): ParcelData => {

    let index: Index = keyOrIndexToIndex(key)(parcelData) + 1;

    return pipeWith(
        parcelData,
        update('value', insert(index, newParcelData.value)),
        update('child', insert(index, {})),
        updateChildKeys()
    );
};
