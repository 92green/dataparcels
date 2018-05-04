// @flow
import type {ParcelData} from '../types/Types';

import clear from 'unmutable/lib/clear';
import del from 'unmutable/lib/delete';
import get from 'unmutable/lib/get';
import reduce from 'unmutable/lib/reduce';
import set from 'unmutable/lib/set';
import shallowToJS from 'unmutable/lib/shallowToJS';
import update from 'unmutable/lib/update';
import isValueObject from 'unmutable/lib/util/isValueObject';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default () => (parcelData: ParcelData): ParcelData => {
    let {value, child} = parcelData;
    let addMeta = update('meta', meta => meta || {});

    if(!isValueObject(value)) {
        return pipeWith(
            parcelData,
            del('child'),
            addMeta
        );
    }

    return pipeWith(
        parcelData,
        set('child', pipeWith(
            value,
            reduce(
                (red, value, key) => pipeWith(
                    red,
                    set(key, child ? get(key, {})(child) : {})
                ),
                pipeWith(
                    value,
                    shallowToJS(),
                    clear()
                )
            )
        )),
        addMeta
    );
};
