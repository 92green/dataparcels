// @flow
import type {
    Key,
    Index,
    ParcelData,
    Property
} from '../types/Types';

import keyOrIndexToProperty from './keyOrIndexToProperty';
import updateChild from './updateChild';
import updateChildKeys from './updateChildKeys';

import identity from 'unmutable/lib/identity';
import has from 'unmutable/lib/has';
import merge from 'unmutable/lib/merge';
import set from 'unmutable/lib/set';
import update from 'unmutable/lib/update';
import updateIn from 'unmutable/lib/updateIn';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index, input: ParcelData) => (parcelData: ParcelData): ParcelData => {
    let property: ?Property = keyOrIndexToProperty(key)(parcelData);

    if(typeof property === "undefined") {
        return parcelData;
    }

    return pipeWith(
        parcelData,
        has('value')(input) ? update('value', set(property, input.value)) : identity(),
        updateChild(),
        updateIn(
            ['child', property],
            pipe(
                input.child ? set('child', input.child) : identity(),
                has('meta')(input) ? update('meta', {}, merge(input.meta)) : identity()
            )
        ),
        updateChildKeys()
    );
};
