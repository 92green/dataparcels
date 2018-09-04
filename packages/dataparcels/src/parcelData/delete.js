// @flow
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {Property} from '../types/Types';

import prepareChildKeys from './prepareChildKeys';
import keyOrIndexToProperty from './keyOrIndexToProperty';

import del from 'unmutable/lib/delete';

export default (key: Key|Index) => (parcelData: ParcelData): ParcelData => {
    let parcelDataWithChildKeys = prepareChildKeys()(parcelData);
    let property: ?Property = keyOrIndexToProperty(key)(parcelDataWithChildKeys);

    if(typeof property === "undefined") {
        return parcelDataWithChildKeys;
    }

    let fn = del(property);
    let {value, child} = parcelDataWithChildKeys;

    return {
        ...parcelDataWithChildKeys,
        value: fn(value),
        child: fn(child)
    };
};
