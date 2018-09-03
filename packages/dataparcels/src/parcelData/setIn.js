// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import getIn from './getIn';
import set from './set';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (keyPath: Array<Key|Index>, newParcelData: ParcelData) => (parcelData: ParcelData): ParcelData => {
    for(var i = keyPath.length - 1; i >= 0; i--) {
        const partialKeyPath = keyPath.slice(0, i);
        newParcelData = pipeWith(
            parcelData,
            getIn(partialKeyPath),
            set(keyPath[i], newParcelData)
        );
    }
    return newParcelData;
};
