// @flow
import type {
    Key,
    ParcelData
} from '../types/Types';

import decodeHashKey from './decodeHashKey';
import updateChild from './updateChild';
import updateChildKeys from './updateChildKeys';

import doIf from 'unmutable/lib/doIf';
import set from 'unmutable/lib/set';
import update from 'unmutable/lib/update';
import updateIn from 'unmutable/lib/updateIn';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key, {value, child}: ParcelData) => (parcelData: ParcelData): ParcelData => {
    key = decodeHashKey(key)(parcelData);
    return pipeWith(
        parcelData,
        update('value', set(key, value)),
        updateChild(),
        updateIn(
            ['child', key],
            doIf(() => child, set('child', child))
        ),
        updateChildKeys()
    );
};
