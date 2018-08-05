// @flow
import type {Key, Index, Property, ParcelData} from '../types/Types';

import keyOrIndexToProperty from './keyOrIndexToProperty';
import del from 'unmutable/lib/delete';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index) => (parcelData: ParcelData): ParcelData => {
    let property: ?Property = keyOrIndexToProperty(key)(parcelData);
    if(typeof property === "undefined") {
        return parcelData;
    }

    let fn = del(property);
    return pipeWith(
        parcelData,
        update('value', fn),
        update('child', fn)
    );
};
