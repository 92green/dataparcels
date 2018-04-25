// @flow
import findKey from 'unmutable/lib/findKey';

export default (key: Key) => ({child}: ParcelData): * => {
    if(key[0] !== "#") {
        return key;
    }
    return findKey((ii) => ii.key === key)(child);
};
