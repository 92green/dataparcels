// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import keyOrIndexToProperty from './keyOrIndexToProperty';
import has from 'unmutable/lib/has';

export default (key: Key|Index) => (parcelData: ParcelData): boolean => {
    let property = keyOrIndexToProperty(key)(parcelData);
    return has(property)(parcelData.value);
};
