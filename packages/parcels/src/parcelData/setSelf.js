// @flow
import type {ParcelData} from '../types/Types';

import has from 'unmutable/lib/has';
import identity from 'unmutable/lib/identity';
import merge from 'unmutable/lib/merge';
import set from 'unmutable/lib/set';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (input: ParcelData) => (parcelData: ParcelData): ParcelData => {
    return pipeWith(
        parcelData,
        has('value')(input) ? set('value', input.value) : identity(),
        has('meta')(input) ? update('meta', merge(input.meta)) : identity()
    );
};
