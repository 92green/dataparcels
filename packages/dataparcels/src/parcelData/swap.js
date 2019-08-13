// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelData} from '../types/Types';

import prepareChildKeys from './prepareChildKeys';
import keyOrIndexToIndex from './keyOrIndexToIndex';

import swap from 'unmutable/lib/swap';

export default (keyA: Key|Index, keyB: Key|Index) => (parcelData: ParcelData): ParcelData => {

    let parcelDataWithChildKeys = prepareChildKeys()(parcelData);

    let indexA: ?Index = keyOrIndexToIndex(keyA)(parcelDataWithChildKeys);
    let indexB: ?Index = keyOrIndexToIndex(keyB)(parcelDataWithChildKeys);

    if(typeof indexA === "undefined" || typeof indexB === "undefined") {
        return parcelData;
    }

    let {value, child} = parcelDataWithChildKeys;

    return {
        ...parcelDataWithChildKeys,
        value: swap(indexA, indexB)(value),
        child: swap(indexA, indexB)(child)
    };
};
