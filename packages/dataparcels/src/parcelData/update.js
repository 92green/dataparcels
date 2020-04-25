// @flow
import type {Index} from '../types/Types';
import type {Key} from '../types/Types';
import type {Property} from '../types/Types';
import type {ParcelData} from '../types/Types';

import has from './has';
import get from './get';
import isParentValue from './isParentValue';
import prepareChildKeys from './prepareChildKeys';
import keyOrIndexToProperty from './keyOrIndexToProperty';
import updateChild from './updateChild';
import updateChildKeys from './updateChildKeys';

import set from 'unmutable/lib/set';
import update from 'unmutable/lib/update';
import pipeWith from 'unmutable/lib/util/pipeWith';

export default (key: Key|Index, updater: Function) => (parcelData: ParcelData): ParcelData => {

    let parcelDataWithChildKeys = prepareChildKeys()(parcelData);
    let property: ?Property = keyOrIndexToProperty(key)(parcelDataWithChildKeys);

    if(property === undefined) {
        return parcelDataWithChildKeys;
    }

    if(!isParentValue(parcelDataWithChildKeys.value)) {
        return parcelData;
    }

    let updatedData = has(key)(parcelDataWithChildKeys)
        ? pipeWith(
            parcelDataWithChildKeys,
            get(key),
            updater
        )
        : updater({value: undefined});

    let {
        value: updatedValue,
        child: updatedChild,
        ...updatedChildValues
    } = updatedData;

    let value = pipeWith(
        parcelDataWithChildKeys.value,
        set(property, updatedValue)
    );

    let child = pipeWith(
        parcelDataWithChildKeys.child,
        update(property, (node) => ({
            ...node,
            child: updatedChild,
            ...updatedChildValues
        }))
    );

    let result = {
        ...parcelDataWithChildKeys,
        value,
        child
    };

    if(isParentValue(result.value)) {
        return pipeWith(
            result,
            updateChild(),
            updateChildKeys()
        );
    }

    return result;
};
