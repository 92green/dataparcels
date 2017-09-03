// @flow
import unwrapParcel from './unwrapParcel';

export default function sanitiseParcelData(data: ParcelData): ParcelData {
    if(typeof data !== "object" || !data.hasOwnProperty('value')) {
        console.warn(`Parcel must be passed an object with "value" (any type) and optional "meta" object`);
        return {
            value: null,
            meta: {}
        };
    }

    var result = {
        value: null,
        meta: {}
    };

    if(data.hasOwnProperty('value')) {
        result.value = unwrapParcel(data.value);
    }
    if(data.hasOwnProperty('meta')) {
        if(typeof data.meta !== "object") {
            console.warn(`Parcel meta must be an object`);
        } else {
            result.meta = data.meta;
        }
    }

    if(data.hasOwnProperty('keys')) {
        result.keys = data.keys;
    }

    return result;
}
