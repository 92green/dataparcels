// @flow
import type ChangeRequest from './ChangeRequest';
import type Action from './Action';
import type {ParcelData} from '../types/Types';
import type {ParcelDataEvaluator} from '../types/Types';

import butLast from 'unmutable/lib/butLast';
import identity from 'unmutable/lib/identity';
import last from 'unmutable/lib/last';
import pipe from 'unmutable/lib/util/pipe';
import pipeWith from 'unmutable/lib/util/pipeWith';
import composeWith from 'unmutable/lib/util/composeWith';

import {ReducerInvalidActionError} from '../errors/Errors';

import {IsReducerCancelAction} from './ReducerCancelAction';

import del from '../parcelData/delete';
import deleteSelfWithMarker from '../parcelData/deleteSelfWithMarker';
import insertAfter from '../parcelData/insertAfter';
import insertBefore from '../parcelData/insertBefore';
import move from '../parcelData/move';
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
    move: ({lastKey, moveKey}) => move(lastKey, moveKey),
    pop: () => pop(),
    push: ({values}) => push(...values),
    setData: parcelData => () => parcelData,
    setMeta: ({meta}) => setMeta(meta),
    set: ({value}) => setSelf(value),
    shift: () => shift(),
    swap: ({lastKey, swapKey}) => swap(lastKey, swapKey),
    swapNext: ({lastKey}) => swapNext(lastKey),
    swapPrev: ({lastKey}) => swapPrev(lastKey),
    unshift: ({values}) => unshift(...values)
};

const parentActionMap = {
    delete: true,
    insertAfter: true,
    insertBefore: true,
    move: true,
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

export default (changeRequest: ChangeRequest) => (parcelData: ParcelData): ?ParcelData => {
    let cancelled = 0;
    let actions = changeRequest.actions();

    let newParcelData = pipeWith(
        parcelData,
        ...actions.map((action): ParcelDataEvaluator => (parcelData: ParcelData): ParcelData => {
            try {
                return doDeepAction(action)(parcelData);
            } catch(e) {
                if(IsReducerCancelAction(e)) {
                    cancelled++;
                    return parcelData;
                }
                throw e;
            }
        })
    );

    return cancelled > 0 && cancelled === actions.length
        ? undefined
        : newParcelData;
};
