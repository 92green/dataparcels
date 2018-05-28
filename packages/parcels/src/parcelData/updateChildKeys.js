// @flow
import type {ParcelData} from '../types/Types';

import {toString26, toInt26} from './convert26';

import filter from 'unmutable/lib/filter';
import get from 'unmutable/lib/get';
import identity from 'unmutable/lib/identity';
import map from 'unmutable/lib/map';
import size from 'unmutable/lib/size';
import set from 'unmutable/lib/set';
import take from 'unmutable/lib/take';
import toArray from 'unmutable/lib/toArray';
import update from 'unmutable/lib/update';
import isIndexed from 'unmutable/lib/util/isIndexed';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';

function toStringKey(num: number): string {
    return `#${toString26(num)}`;
}

function isKey(str: ?string): boolean {
    return str ? str[0] === "#" : false;
}

function toIntKey(str: ?string): ?number {
    // $FlowFixMe - isKey() prevents .slice() from being called on null
    return isKey(str) ? toInt26(str.slice(1)) : undefined;
}

export default () => (parcelData: ParcelData): ParcelData => {
    let {value, child} = parcelData;

    if(!isIndexed(value)) {
        let updateChild = map((node, key) => set('key', key)(node));

        return pipeWith(
            parcelData,
            update('child', updateChild)
        );
    }

    let keys = pipeWith(
        child,
        toArray(),
        map(pipe(
            get('key'),
            toIntKey
        ))
    );

    let highest = pipeWith(
        keys,
        filter(identity()),
        keys => Math.max(0, ...keys)
    );

    let updateChild = pipe(
        take(size()(value)),
        map(
            update('key', key => isKey(key)
                ? key
                : toStringKey(++highest)
            )
        )
    );

    return pipeWith(
        parcelData,
        update('child', updateChild)
    );
};
