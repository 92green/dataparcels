// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {Property} from '../types/Types';
import type {ParcelData} from '../types/Types';

import get from './get';
import prepareChildKeys from './prepareChildKeys';
import keyOrIndexToProperty from './keyOrIndexToProperty';

import set from 'unmutable/lib/set';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

let updateIn = (keyPath: Array<Key|Index>, updater: Function) => (parcelData: ParcelData): ParcelData => {
    if(keyPath.length === 0) {
        return updater(parcelData);
    }

    let [key, ...rest] = keyPath;
    let parcelDataWithChildKeys = prepareChildKeys()(parcelData);
    let property: ?Property = keyOrIndexToProperty(key)(parcelDataWithChildKeys);

    if(typeof property === "undefined") {
        return parcelDataWithChildKeys;
    }

    let before = pipeWith(
        parcelDataWithChildKeys,
        get(key)
    );

    let {
        value: updatedValue,
        ...updatedChildValues
    } = updateIn(rest, updater)(before);

    let value = pipeWith(
        parcelDataWithChildKeys.value,
        set(property, updatedValue)
    );

    let child = pipeWith(
        parcelDataWithChildKeys.child,
        update(property, (node) => ({
            ...node,
            ...updatedChildValues
        }))
    );

    return {
        ...parcelDataWithChildKeys,
        value,
        child
    };
};

export default updateIn;
