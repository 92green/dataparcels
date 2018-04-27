// @flow
import del from 'unmutable/lib/delete';
import get from 'unmutable/lib/get';
import isEmpty from 'unmutable/lib/isEmpty';
import pipe from 'unmutable/lib/util/pipe';

export default () => (newData: Object): Object => {
    // remove child object if it is undefined or empty
    if(typeof get('child')(newData) === "undefined" || pipe(get('child'), isEmpty())(newData)) {
        newData = del('child')(newData);
    }

    // remove key if it is undefined
    if(typeof get('key')(newData) === "undefined") {
        newData = del('key')(newData);
    }

    return newData;
};
