// @flow
import type {
    Key,
    Index,
    ParcelData,
    Property
} from '../types/Types';

import keyOrIndexToProperty from './keyOrIndexToProperty';

export default (key: Key|Index) => (parcelData: ParcelData): ?Index => {
    let property: ?Property = keyOrIndexToProperty(key)(parcelData);
    if(typeof property === "undefined") {
        return undefined;
    }
    if(typeof property !== "number") {
        throw new Error(`Cannot find index on non-indexed parcelData`);
    }
    return property;
};
