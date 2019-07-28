// @flow
import type {Key} from '../types/Types';
import type {Index} from '../types/Types';
import type {ParcelData} from '../types/Types';
import type {Property} from '../types/Types';

import unmutableDel from 'unmutable/lib/delete';
import unmutableInsert from 'unmutable/lib/insert';
import unmutableMove from 'unmutable/lib/move';
import unmutablePop from 'unmutable/lib/pop';
import unmutablePush from 'unmutable/lib/push';
import unmutableSet from 'unmutable/lib/set';
import unmutableShift from 'unmutable/lib/shift';
import unmutableSwap from 'unmutable/lib/swap';
import unmutableUnshift from 'unmutable/lib/unshift';

import keyArray from 'unmutable/keyArray';
import pipe from 'unmutable/lib/pipe';
import pipeIf from 'unmutable/lib/pipeIf';
import pipeWith from 'unmutable/pipeWith';
import size from 'unmutable/lib/size';

import deleted from './deleted';
import isParentValue from './isParentValue';
import keyOrIndexToIndex from './keyOrIndexToIndex';
import keyOrIndexToProperty from './keyOrIndexToProperty';
import prepareChildKeys from './prepareChildKeys';
import parcelUpdate from './update';
import updateChild from './updateChild';
import updateChildKeys from './updateChildKeys';
import wrapNumber from './wrapNumber';

export const del = (key: Key|Index) => (parcelData: ParcelData): ParcelData => {
    let parcelDataWithChildKeys = prepareChildKeys()(parcelData);
    let property: ?Property = keyOrIndexToProperty(key)(parcelDataWithChildKeys);

    if(typeof property === "undefined") {
        return parcelDataWithChildKeys;
    }

    let fn = unmutableDel(property);
    let {value, child} = parcelDataWithChildKeys;

    return {
        ...parcelDataWithChildKeys,
        value: fn(value),
        child: fn(child)
    };
};

export const deleteSelfWithMarker = () => ({
    value: deleted
});

const insert = (after: boolean) => (key: Key|Index, newValue: *) => (parcelData: ParcelData): ParcelData => {
    let parcelDataWithChildKeys = prepareChildKeys()(parcelData);
    let index: ?Index = keyOrIndexToIndex(key)(parcelDataWithChildKeys);

    if(typeof index !== "number") {
        return parcelDataWithChildKeys;
    }

    index = wrapNumber(index, size()(parcelData.value)) + (after ? 1 : 0);
    let {value, child} = parcelDataWithChildKeys;

    return updateChildKeys()({
        ...parcelDataWithChildKeys,
        value: unmutableInsert(index, newValue)(value),
        child: unmutableInsert(index, {})(child)
    });
};

export const insertAfter = insert(true);
export const insertBefore = insert(false);

export const map = (mapper: Function) => (parcelData: ParcelData): ParcelData => {
    let keys = keyArray()(parcelData.value);
    return pipeWith(
        parcelData,
        ...keys.map((key) => parcelUpdate(
            key,
            (childParcelData) => mapper(childParcelData, key, parcelData)
        ))
    );
};

const swapOrMove = (swapOrMove: string): Function => {
    let fn = swapOrMove === 'swap' ? unmutableSwap : unmutableMove;
    return (keyA: Key|Index, keyB: Key|Index) => (parcelData: ParcelData): ParcelData => {

        let parcelDataWithChildKeys = prepareChildKeys()(parcelData);

        let indexA: ?Index = keyOrIndexToIndex(keyA)(parcelDataWithChildKeys);
        let indexB: ?Index = keyOrIndexToIndex(keyB)(parcelDataWithChildKeys);

        if(typeof indexA === "undefined" || typeof indexB === "undefined") {
            return parcelData;
        }

        let {value, child} = parcelDataWithChildKeys;

        return {
            ...parcelDataWithChildKeys,
            value: fn(indexA, indexB)(value),
            child: fn(indexA, indexB)(child)
        };
    };
};

export const move = swapOrMove('move');
export const swap = swapOrMove('swap');

export const pop = () => (parcelData: ParcelData): ParcelData => {
    let {value, child, ...rest} = prepareChildKeys()(parcelData);
    return {
        ...rest,
        value: unmutablePop()(value),
        child: unmutablePop()(child)
    };
};

export const push = (...newValues: Array<*>) => (parcelData: ParcelData): ParcelData => {
    let {value, child, ...rest} = prepareChildKeys()(parcelData);
    let emptyChildren = newValues.map(() => ({}));

    return updateChildKeys()({
        ...rest,
        value: unmutablePush(...newValues)(value),
        child: unmutablePush(...emptyChildren)(child)
    });
};

export const shift = () => (parcelData: ParcelData): ParcelData => {
    let {value, child, ...rest} = prepareChildKeys()(parcelData);
    return {
        ...rest,
        value: unmutableShift()(value),
        child: unmutableShift()(child)
    };
};

export const unshift = (...newValues: Array<*>) => (parcelData: ParcelData): ParcelData => {
    let {value, child, ...rest} = prepareChildKeys()(parcelData);
    let emptyChildren = newValues.map(() => ({}));

    return updateChildKeys()({
        ...rest,
        value: unmutableUnshift(...newValues)(value),
        child: unmutableUnshift(...emptyChildren)(child)
    });
};

export const setMeta = (newMeta: *) => ({meta = {}, ...rest}: ParcelData): ParcelData => ({ /* eslint-disable-line no-unused-vars */
    ...rest,
    meta: {
        ...meta,
        ...newMeta
    }
});

export const setSelf = (value: *) => pipe(
    unmutableDel('child'),
    setValue(value)
);

export const setValue = (value: *) => pipe(
    unmutableSet('value', value),
    pipeIf(
        () => isParentValue(value),
        updateChild(),
        updateChildKeys()
    )
);

const swapNextPrev = (next: boolean) => (key: Key|Index) => (parcelData: ParcelData): ParcelData => {

    let parcelDataWithChildKeys = prepareChildKeys()(parcelData);
    let indexA: ?Index = keyOrIndexToIndex(key)(parcelDataWithChildKeys);

    if(typeof indexA !== "number") {
        return parcelData;
    }

    let {value, child} = parcelDataWithChildKeys;

    let valueSize = size()(value);
    indexA = wrapNumber(indexA, valueSize);
    let indexB: Index = wrapNumber(indexA + (next ? 1 : -1), valueSize);

    return {
        ...parcelDataWithChildKeys,
        value: unmutableSwap(indexA, indexB)(value),
        child: unmutableSwap(indexA, indexB)(child)
    };
};

export const swapNext = swapNextPrev(true);
export const swapPrev = swapNextPrev(false);
