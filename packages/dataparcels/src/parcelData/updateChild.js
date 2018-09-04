// @flow
import type {ParcelData} from '../types/Types';

import clear from 'unmutable/lib/clear';
import get from 'unmutable/lib/get';
import reduce from 'unmutable/lib/reduce';
import set from 'unmutable/lib/set';
import shallowToJS from 'unmutable/lib/shallowToJS';
import isValueObject from 'unmutable/lib/util/isValueObject';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default () => (parcelData: ParcelData): * => {
    let {value, child} = parcelData;

    if(!isValueObject(value)) {
        let {child, ...rest} = parcelData; /* eslint-disable-line no-unused-vars */
        return rest;
    }

    return ({
        ...parcelData,
        child: pipeWith(
            value,
            reduce(
                (red, value, key) => {
                    red[key] = child ? get(key, {})(child) : {};
                    return red;
                },
                pipeWith(
                    value,
                    clear(),
                    shallowToJS()
                )
            )
        )
    });
};
