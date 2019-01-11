// @flow
import type ChangeRequest from './ChangeRequest';
import type Action from './Action';
import type {ParcelDataEvaluator} from '../types/Types';

import butLast from 'unmutable/lib/butLast';
import identity from 'unmutable/lib/identity';
import last from 'unmutable/lib/last';
import pipe from 'unmutable/lib/util/pipe';
import composeWith from 'unmutable/lib/util/composeWith';

import {ReducerInvalidActionError} from '../errors/Errors';
import {ReducerSwapKeyError} from '../errors/Errors';

import del from '../parcelData/delete';
import deleteSelfWithMarker from '../parcelData/deleteSelfWithMarker';
import insertAfter from '../parcelData/insertAfter';
import insertBefore from '../parcelData/insertBefore';
import pop from '../parcelData/pop';
import push from '../parcelData/push';
import setMeta from '../parcelData/setMeta';
import setSelf from '../parcelData/setSelf';
import shift from '../parcelData/shift';
import swap from '../parcelData/swap';
import swapNext from '../parcelData/swapNext';
import swapPrev from '../parcelData/swapPrev';
import unshift from '../parcelData/unshift';
import update from '../parcelData/update';

const actionMap = {
    delete: ({lastKey}) => del(lastKey),
    insertAfter: ({lastKey, value}) => insertAfter(lastKey, value),
    insertBefore: ({lastKey, value}) => insertBefore(lastKey, value),
    pop: () => pop(),
    push: ({value}) => push(value),
    setData: parcelData => () => parcelData,
    setMeta: ({meta}) => setMeta(meta),
    set: ({value}) => setSelf(value),
    shift: () => shift(),
    swap: ({lastKey, swapKey}) => {
        if(typeof swapKey === "undefined") {
            throw ReducerSwapKeyError();
        }
        return swap(lastKey, swapKey);
    },
    swapNext: ({lastKey}) => swapNext(lastKey),
    swapPrev: ({lastKey}) => swapPrev(lastKey),
    unshift: ({value}) => unshift(value)
};

const parentActionMap = {
    delete: true,
    insertAfter: true,
    insertBefore: true,
    swap: true,
    swapNext: true,
    swapPrev: true
};

const doAction = ({keyPath, type, payload}: Action): ParcelDataEvaluator => {
    let fn = actionMap[type];
    if(!fn) {
        throw ReducerInvalidActionError(type);
    }
    return fn({
        ...payload,
        lastKey: last()(keyPath)
    });
};

const doDeepAction = (action: Action): ParcelDataEvaluator => {
    let {keyPathModifiers, type} = action;
    let parentActionEmpty: ?Function = parentActionMap[type];

    if(parentActionEmpty) {
        if(action.keyPath.length === 0) {
            return type === "delete" ? deleteSelfWithMarker : identity();
        }
        keyPathModifiers = butLast()(keyPathModifiers);
    }

    return composeWith(
        ...keyPathModifiers.map(({key, pre, post}) => (next) => pipe(
            ...pre,
            (key || key === 0) ? update(key, next) : next,
            ...post
        )),
        doAction(action)
    );
};

export default (changeRequest: ChangeRequest): ParcelDataEvaluator => pipe(
    ...changeRequest
        .actions()
        .map(doDeepAction)
);
