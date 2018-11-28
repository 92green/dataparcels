// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {ParcelData} from '../types/Types';

import keyOrIndexToIndex from './keyOrIndexToIndex';
import wrapNumber from './wrapNumber';
import prepareChildKeys from './prepareChildKeys';
import updateChildKeys from './updateChildKeys';

import insert from 'unmutable/lib/insert';
import size from 'unmutable/lib/size';

export default (after: boolean) => (key: Key|Index, newValue: *) => (parcelData: ParcelData): ParcelData => {
    let parcelDataWithChildKeys = prepareChildKeys()(parcelData);
    let index: ?Index = keyOrIndexToIndex(key)(parcelDataWithChildKeys);

    if(typeof index !== "number") {
        return parcelDataWithChildKeys;
    }

    index = wrapNumber(index, size()(parcelData.value)) + (after ? 1 : 0);
    let {value, child} = parcelDataWithChildKeys;

    return updateChildKeys()({
        ...parcelDataWithChildKeys,
        value: insert(index, newValue)(value),
        child: insert(index, {})(child)
    });
};
