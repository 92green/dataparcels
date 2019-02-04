// @flow
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';

import get from './get';
import has from './has';
import keyOrIndexToKey from './keyOrIndexToKey';
import isParentValue from './isParentValue';

export default (keyPath: Array<Key|Index>, notFoundValue: ?*) => (parcelData: ParcelData): ParcelData => {
    for(let key of keyPath) {
        if(!isParentValue(parcelData.value) || !has(key)(parcelData)) {
            return {
                value: notFoundValue,
                key: keyOrIndexToKey(key)(parcelData)
            };
        }
        parcelData = get(key, notFoundValue)(parcelData);
    }
    return parcelData;
};
