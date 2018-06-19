// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import findKey from 'unmutable/lib/findKey';

export default (key: Key|Index) => ({child}: ParcelData): Index => {
    if(typeof key !== "string") {
        return key;
    }
    return findKey((ii) => ii.key === key)(child);
};
