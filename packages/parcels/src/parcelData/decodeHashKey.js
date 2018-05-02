// @flow
import type {
    Key,
    Index,
    ParcelData
} from '../types/Types';

import findKey from 'unmutable/lib/findKey';

export default (key: Key) => ({child}: ParcelData): Key|Index => {
    if(key[0] !== "#") {
        return key;
    }
    return findKey((ii) => ii.key === key)(child);
};
