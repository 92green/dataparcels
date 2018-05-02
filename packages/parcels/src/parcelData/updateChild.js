// @flow
import type {
    Index,
    Key,
    ParcelData
} from '../types/Types';

import clear from 'unmutable/lib/clear';
import del from 'unmutable/lib/delete';
import get from 'unmutable/lib/get';
import reduce from 'unmutable/lib/reduce';
import set from 'unmutable/lib/set';
import updateIn from 'unmutable/lib/updateIn';
import isValueObject from 'unmutable/lib/util/isValueObject';
import pipeWith from 'unmutable/lib/util/pipeWith';
import overload from 'unmutable/lib/util/overload';

export default overload({
    ["0"]: () => () => (parcelData: ParcelData): ParcelData => {
        let {value, child} = parcelData;

        if(!isValueObject(value)) {
            return del('child')(parcelData);
        }

        return {
            ...parcelData,
            child: pipeWith(
                value,
                reduce(
                    (red, value, key) => pipeWith(
                        red,
                        set(key, child ? get(key, {})(child) : {})
                    ),
                    clear()(value)
                )
            )
        };
    },
    ["1"]: () => (key: Key|Index) => (parcelData: ParcelData): ParcelData => {
        let {value} = parcelData;

        if(!isValueObject(value)) {
            return del('child')(parcelData);
        }

        return updateIn(['child', key], child => child || {})(parcelData);
    }
});
