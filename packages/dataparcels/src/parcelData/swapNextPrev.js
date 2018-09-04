// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelData} from '../types/Types';

import prepareChildKeys from './prepareChildKeys';
import keyOrIndexToIndex from './keyOrIndexToIndex';
import wrapNumber from './wrapNumber';

import size from 'unmutable/lib/size';
import swap from 'unmutable/lib/swap';

export default (key: Key|Index, next: boolean = false) => (parcelData: ParcelData): ParcelData => {

    let parcelDataWithChildKeys = prepareChildKeys()(parcelData);
    let indexA: ?Index = keyOrIndexToIndex(key)(parcelDataWithChildKeys);

    if(typeof indexA !== "number") {
        return parcelData;
    }

    let {value, child} = parcelDataWithChildKeys;

    let valueSize = size()(value);
    indexA = wrapNumber(indexA, valueSize);
    let indexB: Index = wrapNumber(indexA + (next ? 1 : -1), valueSize);

    return {
        ...parcelDataWithChildKeys,
        value: swap(indexA, indexB)(value),
        child: swap(indexA, indexB)(child)
    };
};
