// @flow
import type Parcel from '../parcel/Parcel';
import type ParcelShape from '../parcelShape/ParcelShape';

import {ParcelTypeMethodMismatch} from '../errors/Errors';
import map from 'unmutable/lib/map';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (parcelType: string, methodCreator: Function) => (parcel: Parcel|ParcelShape, ...args: Array<*>): { [key: string]: Function } => {
    let methods: { [key: string]: Function } = methodCreator(parcel, ...args);

    // $FlowFixMe - I want to do this
    if(parcel[`is${parcelType}`]()) {
        return methods;
    }

    return pipeWith(
        methods,
        map((value, key) => () => {
            throw ParcelTypeMethodMismatch(key.replace('Self', ''), parcelType);
        })
    );
};
