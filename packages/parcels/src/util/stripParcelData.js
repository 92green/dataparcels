// @flow
import del from 'unmutable/lib/delete';
import get from 'unmutable/lib/get';
import isEmpty from 'unmutable/lib/isEmpty';
import pipe from 'unmutable/lib/util/pipe';

type StripParcelDataOptions = {
    stripHandleChange?: boolean
};

export default function stripParcelData(newData: ParcelData, options: StripParcelDataOptions = {}): ParcelData {

    // remove child object if it is undefined or empty
    if(typeof get('child')(newData) === "undefined" || pipe(get('child'), isEmpty())(newData)) {
        newData = del('child')(newData);
    }

    // remove key if it is undefined
    if(typeof get('key')(newData) === "undefined") {
        newData = del('key')(newData);
    }

    if(options.stripHandleChange) {
        newData = del('handleChange')(newData);
    }

    return newData;
}
