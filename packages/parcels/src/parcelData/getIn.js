// @flow

import get from './get';
import has from './has';

export default (keyPath: Key[]) => (parcelData: ParcelData): ParcelData => {
    for(let key of keyPath) {
        if(!has(key)(parcelData)) {
            return undefined;
        }
        parcelData = get(key)(parcelData);
    }
    return parcelData;
};
